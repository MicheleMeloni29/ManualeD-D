"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useSyncExternalStore,
} from "react";
import type {
  AccountSaveData,
  AuthSession,
  StorageBackendType,
  SyncStatus,
} from "@/types/account";
import type { CharacterSheetData } from "@/types/characterSheet";
import type {
  BookmarkItem,
  HighlightColorConfig,
  ThemeMode,
  ViewMode,
} from "@/types/pdf";

const STORAGE_KEY_AUTH_SESSION = "manuale_dnd_auth_session_v1";

const emptySubscribe = () => () => {};

function loadSavedSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_SESSION);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (
      parsed &&
      typeof parsed.accountId === "string" &&
      typeof parsed.masterName === "string" &&
      typeof parsed.characterName === "string"
    ) {
      return {
        accountId: parsed.accountId,
        masterName: parsed.masterName,
        characterName: parsed.characterName,
        slotLabel: parsed.slotLabel || parsed.characterName,
        loggedInAt: parsed.loggedInAt || Date.now(),
      };
    }
  } catch {
    // Ignora errori storage
  }
  return null;
}

/**
 * Pre-scrive il payload di salvataggio Cloud nelle chiavi localStorage specifiche dell'account
 * così che al montaggio dei singoli hook i dati siano già pronti a latenza zero.
 */
function primeAccountLocalStorage(
  accountId: string,
  saveData: AccountSaveData
): void {
  if (typeof window === "undefined") return;
  try {
    if (saveData.characterSheet) {
      localStorage.setItem(
        `manuale_dnd_character_sheet_v2_${accountId}`,
        JSON.stringify(saveData.characterSheet)
      );
    }
    if (Array.isArray(saveData.bookmarks)) {
      localStorage.setItem(
        `manuale_dnd_bookmarks_v1_${accountId}`,
        JSON.stringify(saveData.bookmarks)
      );
    }
    if (
      Array.isArray(saveData.highlightColors) &&
      saveData.highlightColors.length > 0
    ) {
      localStorage.setItem(
        `manuale_dnd_highlight_colors_v1_${accountId}`,
        JSON.stringify(saveData.highlightColors)
      );
    }
    if (saveData.preferences) {
      localStorage.setItem(
        `manuale_dnd_last_page_v1_${accountId}`,
        String(saveData.preferences.lastPage || 1)
      );
      localStorage.setItem(
        `manuale_dnd_view_mode_v1_${accountId}`,
        saveData.preferences.viewMode || "continuous"
      );
      localStorage.setItem(
        `manuale_dnd_theme_v1_${accountId}`,
        saveData.preferences.themeMode || "system"
      );
    }
  } catch {
    // Ignora errori di quota
  }
}

/**
 * Costruisce una stringa deterministica dello stato utente per rilevare modifiche reali
 */
function serializeSyncSnapshot(payload: {
  characterSheet: CharacterSheetData;
  bookmarks: BookmarkItem[];
  highlightColors: HighlightColorConfig[];
  lastPage: number;
  viewMode: ViewMode;
  themeMode: ThemeMode;
}): string {
  return JSON.stringify({
    characterSheet: payload.characterSheet,
    bookmarks: payload.bookmarks,
    highlightColors: payload.highlightColors,
    preferences: {
      lastPage: payload.lastPage,
      viewMode: payload.viewMode,
      themeMode: payload.themeMode,
    },
  });
}

/**
 * Hook principale per gestire l'autenticazione a uno dei 6 account D&D
 */
export function useAccountAuth() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [sessionState, setSessionState] = useState<AuthSession | null>(() =>
    loadSavedSession()
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [initialCloudData, setInitialCloudData] =
    useState<AccountSaveData | null>(null);
  const [storageBackend, setStorageBackend] =
    useState<StorageBackendType>("local-file");

  const session = isHydrated ? sessionState : null;

  const login = useCallback(
    async (masterName: string, characterName: string): Promise<boolean> => {
      setIsLoggingIn(true);
      setLoginError(null);
      try {
        const res = await fetch("/api/accounts/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            masterName: masterName.trim(),
            characterName: characterName.trim(),
          }),
        });

        const data = (await res.json()) as {
          error?: string;
          account?: {
            id: string;
            masterName: string;
            characterName: string;
            slotLabel: string;
          };
          saveData?: AccountSaveData;
          backend?: StorageBackendType;
        };

        if (!res.ok || !data.account || !data.saveData) {
          setLoginError(
            data.error ||
              "Credenziali non valide. Controlla Nome del Master e Nome Personaggio."
          );
          return false;
        }

        const newSession: AuthSession = {
          accountId: data.account.id,
          masterName: data.account.masterName,
          characterName: data.account.characterName,
          slotLabel: data.account.slotLabel,
          loggedInAt: Date.now(),
        };

        primeAccountLocalStorage(newSession.accountId, data.saveData);
        try {
          localStorage.setItem(
            STORAGE_KEY_AUTH_SESSION,
            JSON.stringify(newSession)
          );
        } catch {
          // Ignora errori storage
        }

        if (data.backend) {
          setStorageBackend(data.backend);
        }
        setInitialCloudData(data.saveData);
        setSessionState(newSession);
        return true;
      } catch {
        setLoginError(
          "Errore di connessione al server. Riprova tra qualche istante."
        );
        return false;
      } finally {
        setIsLoggingIn(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setSessionState(null);
    setInitialCloudData(null);
    setLoginError(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY_AUTH_SESSION);
      } catch {
        // Ignora errori
      }
    }
  }, []);

  return {
    isHydrated,
    session,
    isLoggingIn,
    loginError,
    clearLoginError: () => setLoginError(null),
    initialCloudData,
    storageBackend,
    setStorageBackend,
    login,
    logout,
  };
}

export interface UseAccountCloudSyncOptions {
  session: AuthSession;
  initialCloudData: AccountSaveData | null;
  onInvalidSession: () => void;
  onBackendDetected?: (backend: StorageBackendType) => void;
  characterSheet: CharacterSheetData;
  hydrateSheet: (sheet: Partial<CharacterSheetData>) => void;
  bookmarks: BookmarkItem[];
  highlightColors: HighlightColorConfig[];
  hydrateBookmarksData: (
    bookmarks: BookmarkItem[],
    colors: HighlightColorConfig[]
  ) => void;
  currentPage: number;
  viewMode: ViewMode;
  hydrateNavigationPreferences: (prefs: {
    lastPage?: number;
    viewMode?: ViewMode;
  }) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

/**
 * Hook che sincronizza in modo bidirezionale i salvataggi dell'account attivo
 * con il database Cloud (Upstash Redis su Vercel o file JSON in locale).
 */
export function useAccountCloudSync({
  session,
  initialCloudData,
  onInvalidSession,
  onBackendDetected,
  characterSheet,
  hydrateSheet,
  bookmarks,
  highlightColors,
  hydrateBookmarksData,
  currentPage,
  viewMode,
  hydrateNavigationPreferences,
  themeMode,
  setThemeMode,
}: UseAccountCloudSyncOptions) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    initialCloudData && initialCloudData.updatedAt > 0 ? "saved" : "idle"
  );
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(
    () => initialCloudData?.updatedAt || null
  );

  const isCloudReadyRef = useRef<boolean>(Boolean(initialCloudData));
  const lastSyncedSnapshotRef = useRef<string>(
    initialCloudData && initialCloudData.updatedAt > 0
      ? serializeSyncSnapshot({
          characterSheet: initialCloudData.characterSheet,
          bookmarks: initialCloudData.bookmarks,
          highlightColors: initialCloudData.highlightColors,
          lastPage: initialCloudData.preferences.lastPage,
          viewMode: initialCloudData.preferences.viewMode,
          themeMode: initialCloudData.preferences.themeMode,
        })
      : ""
  );
  const lastSyncedUpdatedAtRef = useRef<number>(
    initialCloudData?.updatedAt ?? 0
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFetchingCloudRef = useRef<boolean>(false);

  const currentSnapshot = useMemo(
    () =>
      serializeSyncSnapshot({
        characterSheet,
        bookmarks,
        highlightColors,
        lastPage: currentPage,
        viewMode,
        themeMode,
      }),
    [
      characterSheet,
      bookmarks,
      highlightColors,
      currentPage,
      viewMode,
      themeMode,
    ]
  );

  const latestPayloadRef = useRef({
    characterSheet,
    bookmarks,
    highlightColors,
    preferences: {
      lastPage: currentPage,
      viewMode,
      themeMode,
    },
    snapshot: currentSnapshot,
  });

  useEffect(() => {
    latestPayloadRef.current = {
      characterSheet,
      bookmarks,
      highlightColors,
      preferences: {
        lastPage: currentPage,
        viewMode,
        themeMode,
      },
      snapshot: currentSnapshot,
    };
  }, [
    characterSheet,
    bookmarks,
    highlightColors,
    currentPage,
    viewMode,
    themeMode,
    currentSnapshot,
  ]);

  // Applica un salvataggio Cloud ricevuto dal server senza innescare un ciclo di re-save
  const applyCloudSave = useCallback(
    (cloudSave: AccountSaveData) => {
      const cloudSnap = serializeSyncSnapshot({
        characterSheet: cloudSave.characterSheet,
        bookmarks: cloudSave.bookmarks,
        highlightColors: cloudSave.highlightColors,
        lastPage: cloudSave.preferences.lastPage,
        viewMode: cloudSave.preferences.viewMode,
        themeMode: cloudSave.preferences.themeMode,
      });

      lastSyncedSnapshotRef.current = cloudSnap;
      lastSyncedUpdatedAtRef.current = cloudSave.updatedAt || Date.now();
      setLastSavedAt(lastSyncedUpdatedAtRef.current);

      hydrateSheet(cloudSave.characterSheet);
      hydrateBookmarksData(cloudSave.bookmarks, cloudSave.highlightColors);
      hydrateNavigationPreferences({
        lastPage: cloudSave.preferences.lastPage,
        viewMode: cloudSave.preferences.viewMode,
      });
      setThemeMode(cloudSave.preferences.themeMode);
      setSyncStatus("saved");
    },
    [
      hydrateSheet,
      hydrateBookmarksData,
      hydrateNavigationPreferences,
      setThemeMode,
    ]
  );

  // Invia immediatamente lo stato corrente al server
  const pushToCloud = useCallback(
    async (keepalive = false): Promise<boolean> => {
      const current = latestPayloadRef.current;
      setSyncStatus("syncing");

      try {
        const res = await fetch("/api/accounts/sync", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          keepalive,
          body: JSON.stringify({
            accountId: session.accountId,
            masterName: session.masterName,
            characterName: session.characterName,
            saveData: {
              characterSheet: current.characterSheet,
              bookmarks: current.bookmarks,
              highlightColors: current.highlightColors,
              preferences: current.preferences,
            },
          }),
        });

        if (res.status === 401) {
          onInvalidSession();
          return false;
        }

        if (!res.ok) {
          setSyncStatus("error");
          return false;
        }

        const data = (await res.json()) as {
          saveData?: AccountSaveData;
          backend?: StorageBackendType;
        };

        if (data.backend && onBackendDetected) {
          onBackendDetected(data.backend);
        }

        lastSyncedSnapshotRef.current = current.snapshot;
        const savedTimestamp = data.saveData?.updatedAt || Date.now();
        lastSyncedUpdatedAtRef.current = savedTimestamp;
        setLastSavedAt(savedTimestamp);
        setSyncStatus("saved");
        return true;
      } catch {
        setSyncStatus("error");
        return false;
      }
    },
    [session, onInvalidSession, onBackendDetected]
  );

  // Scarica la versione più recente dal server (all'avvio o al ritorno sul tab da un altro dispositivo)
  const pullFromCloud = useCallback(
    async (isInitialMount = false) => {
      if (isFetchingCloudRef.current) return;
      isFetchingCloudRef.current = true;

      try {
        const params = new URLSearchParams({
          accountId: session.accountId,
        });
        const res = await fetch(`/api/accounts/sync?${params.toString()}`, {
          method: "GET",
          headers: {
            "x-account-id": session.accountId,
            "x-master-name": session.masterName,
            "x-character-name": session.characterName,
          },
          cache: "no-store",
        });

        if (res.status === 401) {
          onInvalidSession();
          return;
        }

        if (!res.ok) {
          isCloudReadyRef.current = true;
          setSyncStatus("error");
          return;
        }

        const data = (await res.json()) as {
          saveData?: AccountSaveData;
          backend?: StorageBackendType;
        };

        if (data.backend && onBackendDetected) {
          onBackendDetected(data.backend);
        }

        if (data.saveData) {
          const remoteUpdatedAt = data.saveData.updatedAt || 0;
          if (remoteUpdatedAt > 0) {
            if (
              isInitialMount ||
              remoteUpdatedAt > lastSyncedUpdatedAtRef.current
            ) {
              applyCloudSave(data.saveData);
            }
          } else if (isInitialMount) {
            // Slot cloud ancora vergine: inizializzalo con lo stato corrente dell'account
            lastSyncedSnapshotRef.current = "";
            isCloudReadyRef.current = true;
            await pushToCloud();
            return;
          }
        }

        isCloudReadyRef.current = true;
      } catch {
        isCloudReadyRef.current = true;
        setSyncStatus("error");
      } finally {
        isFetchingCloudRef.current = false;
      }
    },
    [session, onInvalidSession, onBackendDetected, applyCloudSave, pushToCloud]
  );

  // 1. All'avvio della sessione: se non abbiamo già i dati freschi di login, scarica dal Cloud
  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (initialCloudData) {
        if (initialCloudData.updatedAt === 0) {
          isCloudReadyRef.current = true;
          void pushToCloud();
        }
      } else {
        void pullFromCloud(true);
      }
    }, 0);

    return () => clearTimeout(initTimer);
    // Eseguito solo quando cambia l'accountId della sessione
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.accountId]);

  // 2. Auto-save con debounce (700ms) ad ogni modifica locale di scheda, segnalibri, pagina o tema
  useEffect(() => {
    if (!isCloudReadyRef.current) return;
    if (currentSnapshot === lastSyncedSnapshotRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      void pushToCloud();
    }, 700);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentSnapshot, pushToCloud]);

  // 3. Sincronizzazione automatica quando si torna sulla scheda/app (multi-dispositivo) o si chiude la pagina
  useEffect(() => {
    const handleFocus = () => {
      if (!isCloudReadyRef.current) return;
      // Se non ci sono modifiche locali in attesa di invio, controlla se l'altro dispositivo ha salvato dati più recenti
      if (
        latestPayloadRef.current.snapshot === lastSyncedSnapshotRef.current
      ) {
        void pullFromCloud(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (
          isCloudReadyRef.current &&
          latestPayloadRef.current.snapshot !== lastSyncedSnapshotRef.current
        ) {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          void pushToCloud(true);
        }
      } else if (document.visibilityState === "visible") {
        handleFocus();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pullFromCloud, pushToCloud]);

  // Sincronizzazione manuale immediata (pulsante "Sincronizza ora")
  const syncNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (latestPayloadRef.current.snapshot !== lastSyncedSnapshotRef.current) {
      await pushToCloud();
    } else {
      await pullFromCloud(true);
    }
  }, [pushToCloud, pullFromCloud]);

  return {
    syncStatus,
    lastSavedAt,
    syncNow,
  };
}
