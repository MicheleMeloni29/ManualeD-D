import type { CharacterSheetData } from "./characterSheet";
import type {
  BookmarkItem,
  HighlightColorConfig,
  ThemeMode,
  ViewMode,
} from "./pdf";

/**
 * Preferenze di lettura e visualizzazione sincronizzate per ogni account
 */
export interface AccountPreferences {
  lastPage: number;
  viewMode: ViewMode;
  themeMode: ThemeMode;
}

/**
 * Struttura completa del salvataggio associato a ciascuno dei 6 account
 */
export interface AccountSaveData {
  accountId: string;
  characterSheet: CharacterSheetData;
  bookmarks: BookmarkItem[];
  highlightColors: HighlightColorConfig[];
  preferences: AccountPreferences;
  updatedAt: number;
}

/**
 * Sessione autenticata salvata sul dispositivo corrente
 */
export interface AuthSession {
  accountId: string;
  masterName: string;
  characterName: string;
  slotLabel: string;
  loggedInAt: number;
}

/**
 * Stato corrente della sincronizzazione Cloud
 */
export type SyncStatus =
  | "idle"
  | "syncing"
  | "saved"
  | "local-only"
  | "error";

/**
 * Tipo di storage backend attivo lato server
 */
export type StorageBackendType = "upstash-redis" | "local-file";
