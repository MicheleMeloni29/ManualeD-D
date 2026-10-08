import { promises as fs } from "fs";
import path from "path";
import type { AccountSaveData, StorageBackendType } from "@/types/account";
import { createEmptyCharacterSheet } from "@/types/characterSheet";
import { DEFAULT_HIGHLIGHT_COLORS } from "@/types/pdf";

const REDIS_KEY_PREFIX = "manuale_dnd:account_save:v1:";
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, "accounts-saves.json");

/**
 * Rileva le credenziali Upstash Redis / Vercel KV dalle variabili d'ambiente
 */
function getUpstashConfig(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.STORAGE_REST_API_URL ||
    "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.STORAGE_REST_API_TOKEN ||
    "";

  if (url.trim() && token.trim()) {
    return {
      url: url.trim().replace(/\/+$/, ""),
      token: token.trim(),
    };
  }
  return null;
}

/**
 * Restituisce quale motore di persistenza è attivo sul server
 */
export function getActiveStorageBackend(): StorageBackendType {
  return getUpstashConfig() ? "upstash-redis" : "local-file";
}

/**
 * Crea il salvataggio iniziale predefinito per un nuovo account,
 * pre-compilando il nome del personaggio nella scheda D&D 5e.
 */
export function createDefaultAccountSave(
  accountId: string,
  defaultCharacterName: string
): AccountSaveData {
  const emptySheet = createEmptyCharacterSheet();
  emptySheet.characterName = defaultCharacterName;

  return {
    accountId,
    characterSheet: emptySheet,
    bookmarks: [],
    highlightColors: DEFAULT_HIGHLIGHT_COLORS,
    preferences: {
      lastPage: 1,
      viewMode: "continuous",
      themeMode: "system",
    },
    updatedAt: 0,
  };
}

/**
 * Normalizza e valida un payload di salvataggio proveniente dal database o dal client
 */
export function sanitizeAccountSaveData(
  accountId: string,
  defaultCharacterName: string,
  raw: Partial<AccountSaveData> | null | undefined
): AccountSaveData {
  const fallback = createDefaultAccountSave(accountId, defaultCharacterName);
  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const baseSheet = fallback.characterSheet;
  const incomingSheet = raw.characterSheet;

  const mergedSheet =
    incomingSheet && typeof incomingSheet === "object"
      ? {
          ...baseSheet,
          ...incomingSheet,
          characterName:
            incomingSheet.characterName?.trim() || defaultCharacterName,
          abilities: {
            ...baseSheet.abilities,
            ...(incomingSheet.abilities ?? {}),
          },
          skills: {
            ...baseSheet.skills,
            ...(incomingSheet.skills ?? {}),
          },
          armorInfo: {
            ...baseSheet.armorInfo,
            ...(incomingSheet.armorInfo ?? {}),
          },
          coins: {
            ...baseSheet.coins,
            ...(incomingSheet.coins ?? {}),
          },
          proficiencies: {
            ...baseSheet.proficiencies,
            ...(incomingSheet.proficiencies ?? {}),
          },
          hitDice1: {
            ...baseSheet.hitDice1,
            ...(incomingSheet.hitDice1 ?? {}),
          },
          hitDice2: {
            ...baseSheet.hitDice2,
            ...(incomingSheet.hitDice2 ?? {}),
          },
          deathSaves: {
            ...baseSheet.deathSaves,
            ...(incomingSheet.deathSaves ?? {}),
          },
          spellLevels: {
            ...baseSheet.spellLevels,
            ...(incomingSheet.spellLevels ?? {}),
          },
        }
      : baseSheet;

  const bookmarks = Array.isArray(raw.bookmarks) ? raw.bookmarks : [];
  const highlightColors =
    Array.isArray(raw.highlightColors) && raw.highlightColors.length > 0
      ? raw.highlightColors
      : DEFAULT_HIGHLIGHT_COLORS;

  const rawPrefs = raw.preferences;
  const lastPage =
    typeof rawPrefs?.lastPage === "number" &&
    rawPrefs.lastPage >= 1 &&
    rawPrefs.lastPage <= 321
      ? Math.floor(rawPrefs.lastPage)
      : 1;

  const viewMode =
    rawPrefs?.viewMode === "continuous" ||
    rawPrefs?.viewMode === "single" ||
    rawPrefs?.viewMode === "book"
      ? rawPrefs.viewMode
      : "continuous";

  const themeMode =
    rawPrefs?.themeMode === "system" ||
    rawPrefs?.themeMode === "light" ||
    rawPrefs?.themeMode === "dark" ||
    rawPrefs?.themeMode === "sepia"
      ? rawPrefs.themeMode
      : "system";

  return {
    accountId,
    characterSheet: mergedSheet,
    bookmarks,
    highlightColors,
    preferences: {
      lastPage,
      viewMode,
      themeMode,
    },
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
  };
}

/**
 * Legge la mappa completa dei salvataggi dal file JSON locale di fallback
 */
async function readLocalStoreFile(): Promise<Record<string, AccountSaveData>> {
  try {
    const content = await fs.readFile(LOCAL_DATA_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, AccountSaveData>;
    }
  } catch {
    // Il file non esiste ancora o non è leggibile
  }
  return {};
}

/**
 * Scrive la mappa completa dei salvataggi sul file JSON locale di fallback
 */
async function writeLocalStoreFile(
  store: Record<string, AccountSaveData>
): Promise<void> {
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
    await fs.writeFile(
      LOCAL_DATA_FILE,
      JSON.stringify(store, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.warn("Impossibile scrivere sul file locale .data:", err);
  }
}

/**
 * Carica il salvataggio di uno specifico account (da Upstash Redis oppure da file JSON locale)
 */
export async function loadAccountSave(
  accountId: string,
  defaultCharacterName: string
): Promise<{ data: AccountSaveData; backend: StorageBackendType }> {
  const upstash = getUpstashConfig();

  if (upstash) {
    const redisKey = `${REDIS_KEY_PREFIX}${accountId}`;
    const res = await fetch(upstash.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstash.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["GET", redisKey]),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Upstash GET error: ${res.status}`);
    }

    const payload = (await res.json()) as { result?: string | null };
    if (payload.result) {
      const parsed = JSON.parse(payload.result) as Partial<AccountSaveData>;
      return {
        data: sanitizeAccountSaveData(accountId, defaultCharacterName, parsed),
        backend: "upstash-redis",
      };
    }

    return {
      data: createDefaultAccountSave(accountId, defaultCharacterName),
      backend: "upstash-redis",
    };
  }

  // Fallback su file JSON locale (.data/accounts-saves.json)
  const store = await readLocalStoreFile();
  const existing = store[accountId];
  return {
    data: sanitizeAccountSaveData(accountId, defaultCharacterName, existing),
    backend: "local-file",
  };
}

/**
 * Salva lo stato completo di uno specifico account (su Upstash Redis oppure su file JSON locale)
 */
export async function saveAccountData(
  accountId: string,
  defaultCharacterName: string,
  incomingData: Partial<AccountSaveData>
): Promise<{ data: AccountSaveData; backend: StorageBackendType }> {
  const sanitized = sanitizeAccountSaveData(accountId, defaultCharacterName, {
    ...incomingData,
    accountId,
    updatedAt: Date.now(),
  });

  const upstash = getUpstashConfig();

  if (upstash) {
    const redisKey = `${REDIS_KEY_PREFIX}${accountId}`;
    const res = await fetch(upstash.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstash.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", redisKey, JSON.stringify(sanitized)]),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Upstash SET error: ${res.status}`);
    }

    return {
      data: sanitized,
      backend: "upstash-redis",
    };
  }

  // Fallback su file JSON locale (.data/accounts-saves.json)
  const store = await readLocalStoreFile();
  store[accountId] = sanitized;
  await writeLocalStoreFile(store);

  return {
    data: sanitized,
    backend: "local-file",
  };
}
