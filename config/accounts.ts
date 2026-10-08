/**
 * Configurazione centrale dei 6 Account del Party D&D.
 *
 * ISTRUZIONI PER IL MASTER:
 * 1. Imposta `DEFAULT_MASTER_NAME` con il tuo nome da Dungeon Master.
 * 2. Modifica il campo `characterName` di ciascuno dei 6 account con il nome
 *    del personaggio scelto da ogni giocatore.
 *
 * NOTA: Il controllo delle credenziali ignora automaticamente maiuscole/minuscole,
 * accenti e spazi iniziali/finali o doppi (es. "Thorin  Scudodiquercia" == "thorin scudodiquercia").
 */

export interface AccountConfig {
  /** Identificativo univoco immutabile dello slot salvataggio (account-1 ... account-6) */
  id: string;
  /** Nome del Dungeon Master associato all'account */
  masterName: string;
  /** Nome del Personaggio (usato come seconda credenziale di accesso e nome iniziale scheda) */
  characterName: string;
  /** Etichetta descrittiva dello slot (es. "Giocatore 1") */
  slotLabel: string;
}

export interface PublicAccountProfile {
  id: string;
  masterName: string;
  characterName: string;
  slotLabel: string;
}

/**
 * Nome predefinito del Dungeon Master per tutta la campagna.
 * Puoi cambiarlo qui una volta sola per tutti e 6 gli account!
 */
export const DEFAULT_MASTER_NAME = "Reus";

/**
 * Elenco dei 6 Account della campagna D&D.
 * Sostituisci `characterName` con i nomi reali dei 6 personaggi del tuo gruppo.
 */
export const DND_ACCOUNTS: AccountConfig[] = [
  {
    id: "account-1",
    masterName: DEFAULT_MASTER_NAME,
    characterName: "Vaghar",
    slotLabel: "Avventuriero 1",
  },
  {
    id: "account-2",
    masterName: DEFAULT_MASTER_NAME,
    characterName: "Elarion",
    slotLabel: "Avventuriero 2",
  },
  {
    id: "account-3",
    masterName: DEFAULT_MASTER_NAME,
    characterName: "Sennar",
    slotLabel: "Avventuriero 3",
  },
  {
    id: "account-4",
    masterName: DEFAULT_MASTER_NAME,
    characterName: "Merezius",
    slotLabel: "Avventuriero 4",
  },
  {
    id: "account-5",
    masterName: DEFAULT_MASTER_NAME,
    characterName: "Ozzy",
    slotLabel: "Avventuriero 5",
  },
  {
    id: "account-6",
    masterName: DEFAULT_MASTER_NAME,
    characterName: "Master",
    slotLabel: "Avventuriero 6",
  },
];

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
 * Restituisce la lista degli account attivi (supporta anche un eventuale override
 * tramite variabile d'ambiente `DND_ACCOUNTS_JSON` su Vercel).
 */
export function getConfiguredAccounts(): AccountConfig[] {
  const envJson = process.env.DND_ACCOUNTS_JSON;
  if (envJson) {
    try {
      const parsed = JSON.parse(envJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          id: String(item.id || `account-${idx + 1}`),
          masterName: String(item.masterName || DEFAULT_MASTER_NAME),
          characterName: String(item.characterName || `Personaggio ${idx + 1}`),
          slotLabel: String(item.slotLabel || `Avventuriero ${idx + 1}`),
        }));
      }
    } catch {
      // Fallback alla configurazione statica in caso di JSON non valido
    }
  }
  return DND_ACCOUNTS;
}

/**
 * Verifica la coppia (Nome del Master, Nome Personaggio) e restituisce il profilo pubblico
 * dell'account corrispondente, oppure `null` se le credenziali non coincidono.
 */
export function verifyAccountCredentials(
  masterNameInput: string,
  characterNameInput: string
): PublicAccountProfile | null {
  const normMaster = normalizeCredential(masterNameInput || "");
  const normChar = normalizeCredential(characterNameInput || "");

  if (!normMaster || !normChar) return null;

  const accounts = getConfiguredAccounts();
  const matched = accounts.find(
    (acc) =>
      normalizeCredential(acc.masterName) === normMaster &&
      normalizeCredential(acc.characterName) === normChar
  );

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
