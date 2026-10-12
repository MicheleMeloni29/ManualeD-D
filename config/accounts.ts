/**
 * Configurazione centrale dei 6 Account del Party D&D.
 *
 * SICUREZZA & PRIVACY (Repository GitHub Pubblica):
 * Nessuna credenziale reale è salvata in questo file.
 * I nomi reali del Master e dei 6 Personaggi vengono letti lato server
 * dalle variabili d'ambiente definite in `.env.local` (in locale) e
 * nelle "Environment Variables" del progetto su Vercel (in produzione):
 *
 *   DND_MASTER_NAME="..."
 *   DND_CHARACTER_1="..."
 *   DND_CHARACTER_2="..."
 *   DND_CHARACTER_3="..."
 *   DND_CHARACTER_4="..."
 *   DND_CHARACTER_5="..."
 *   DND_CHARACTER_6="..."
 *
 * NOTA: Il controllo delle credenziali ignora automaticamente maiuscole/minuscole,
 * accenti e spazi iniziali/finali o doppi.
 */

export interface AccountConfig {
  /** Identificativo univoco immutabile dello slot salvataggio (account-1 ... account-6) */
  id: string;
  /** Nome del Dungeon Master associato all'account */
  masterName: string;
  /** Nome del Personaggio (usato come seconda credenziale di accesso e nome iniziale scheda) */
  characterName: string;
  /** Etichetta descrittiva dello slot (es. "Avventuriero 1") */
  slotLabel: string;
}

export interface PublicAccountProfile {
  id: string;
  masterName: string;
  characterName: string;
  slotLabel: string;
}

const TOTAL_PARTY_SLOTS = 6;

/**
 * Normalizza una stringa credenziale per confronti case-insensitive,
 * ignorando spazi extra e differenze di accenti.
 */
export function normalizeCredential(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Costruisce dinamicamente la lista dei 6 account leggendo le variabili d'ambiente
 * lato server (`DND_MASTER_NAME` e `DND_CHARACTER_1` ... `DND_CHARACTER_6`).
 * Supporta anche `DND_MASTER_1` ... `DND_MASTER_6` se si volessero master distinti,
 * oppure `DND_ACCOUNTS_JSON` come override avanzato.
 */
export function getConfiguredAccounts(): AccountConfig[] {
  const defaultMaster = (process.env.DND_MASTER_NAME ?? "").trim();

  const envJson = process.env.DND_ACCOUNTS_JSON;
  if (envJson) {
    try {
      const parsed = JSON.parse(envJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          id: String(item.id || `account-${idx + 1}`),
          masterName: String(item.masterName || defaultMaster).trim(),
          characterName: String(item.characterName || "").trim(),
          slotLabel: String(item.slotLabel || `Avventuriero ${idx + 1}`),
        }));
      }
    } catch {
      // Fallback alle variabili DND_CHARACTER_1..6 in caso di JSON non valido
    }
  }

  const accounts: AccountConfig[] = [];
  for (let i = 1; i <= TOTAL_PARTY_SLOTS; i++) {
    const slotMaster = (
      process.env[`DND_MASTER_${i}`] ??
      defaultMaster
    ).trim();
    const slotCharacter = (process.env[`DND_CHARACTER_${i}`] ?? "").trim();

    accounts.push({
      id: `account-${i}`,
      masterName: slotMaster,
      characterName: slotCharacter,
      slotLabel: `Avventuriero ${i}`,
    });
  }

  return accounts;
}

/**
 * Verifica la coppia (Nome del Master, Nome Personaggio) e restituisce il profilo pubblico
 * dell'account corrispondente, oppure `null` se le credenziali non coincidono
 * o se lo slot non è stato configurato nelle variabili d'ambiente.
 */
export function verifyAccountCredentials(
  masterNameInput: string,
  characterNameInput: string
): PublicAccountProfile | null {
  const normMaster = normalizeCredential(masterNameInput || "");
  const normChar = normalizeCredential(characterNameInput || "");

  if (!normMaster || !normChar) return null;

  const accounts = getConfiguredAccounts();
  const matched = accounts.find((acc) => {
    const accMaster = normalizeCredential(acc.masterName);
    const accChar = normalizeCredential(acc.characterName);
    // Se una variabile d'ambiente è vuota/non configurata, impedisce qualsiasi accesso a quello slot
    if (!accMaster || !accChar) return false;
    return accMaster === normMaster && accChar === normChar;
  });

  if (!matched) return null;

  return {
    id: matched.id,
    masterName: matched.masterName,
    characterName: matched.characterName,
    slotLabel: matched.slotLabel,
  };
}

/**
 * Verifica che un `accountId` appartenga effettivamente alle credenziali fornite.
 */
export function verifyAccountAccessById(
  accountId: string,
  masterNameInput: string,
  characterNameInput: string
): PublicAccountProfile | null {
  const verified = verifyAccountCredentials(masterNameInput, characterNameInput);
  if (!verified || verified.id !== accountId) {
    return null;
  }
  return verified;
}
