"use client";

import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import type {
  BookmarkItem,
  HighlightColor,
  HighlightColorConfig,
  NormalizedRect,
} from "@/types/pdf";
import {
  DEFAULT_HIGHLIGHT_COLORS,
  buildColorStylesFromHex,
  getHighlightColorConfig,
} from "@/types/pdf";

const STORAGE_KEY_BOOKMARKS = "manuale_dnd_bookmarks_v1";
const STORAGE_KEY_HIGHLIGHT_COLORS = "manuale_dnd_highlight_colors_v1";

function getBookmarksKey(accountId?: string): string {
  return accountId
    ? `${STORAGE_KEY_BOOKMARKS}_${accountId}`
    : STORAGE_KEY_BOOKMARKS;
}

function getHighlightColorsKey(accountId?: string): string {
  return accountId
    ? `${STORAGE_KEY_HIGHLIGHT_COLORS}_${accountId}`
    : STORAGE_KEY_HIGHLIGHT_COLORS;
}

function normalizeHighlightColors(
  parsed: unknown
): HighlightColorConfig[] {
  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map((item: HighlightColorConfig) => {
      const styles = buildColorStylesFromHex(item.hex || "#facc15");
      return {
        id: String(item.id),
        label: String(item.label || "Evidenziatore"),
        hex: styles.hex,
        bgStyle: item.bgStyle || styles.bgStyle,
        borderStyle: item.borderStyle || styles.borderStyle,
        isCustom: Boolean(item.isCustom),
      };
    });
  }
  return DEFAULT_HIGHLIGHT_COLORS;
}

function loadInitialBookmarks(accountId?: string): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getBookmarksKey(accountId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignora errori di parsing/storage
  }
  return [];
}

function loadInitialHighlightColors(
  accountId?: string
): HighlightColorConfig[] {
  if (typeof window === "undefined") return DEFAULT_HIGHLIGHT_COLORS;
  try {
    const raw = localStorage.getItem(getHighlightColorsKey(accountId));
    if (raw) {
      const parsed = JSON.parse(raw);
      return normalizeHighlightColors(parsed);
    }
  } catch {
    // Ignora errori di parsing/storage
  }
  return DEFAULT_HIGHLIGHT_COLORS;
}

const emptySubscribe = () => () => {};

export interface AddHighlightBookmarkInput {
  pageNumber: number;
  type: "text" | "area";
  color: HighlightColor;
  rects: NormalizedRect[];
  highlightedText?: string;
  label?: string;
  chapterTitle?: string;
}

export function useBookmarks(accountId?: string) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const bookmarksKey = useMemo(() => getBookmarksKey(accountId), [accountId]);
  const colorsKey = useMemo(
    () => getHighlightColorsKey(accountId),
    [accountId]
  );

  const [bookmarksState, setBookmarksState] = useState<BookmarkItem[]>(() =>
    loadInitialBookmarks(accountId)
  );

  const [highlightColorsState, setHighlightColorsState] = useState<
    HighlightColorConfig[]
  >(() => loadInitialHighlightColors(accountId));

  // ID dell'evidenziazione temporaneamente messa in risalto (pulse) dopo un clic dalla sidebar
  const [focusedHighlightId, setFocusedHighlightId] = useState<string | null>(
    null
  );
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bookmarks = useMemo(
    () => (isHydrated ? bookmarksState : []),
    [isHydrated, bookmarksState]
  );

  const highlightColors = useMemo(
    () => (isHydrated ? highlightColorsState : DEFAULT_HIGHLIGHT_COLORS),
    [isHydrated, highlightColorsState]
  );

  // Raggruppa per pagina tutte le evidenziazioni che possiedono coordinate geometriche sulla pagina
  const highlightsByPage = useMemo(() => {
    const map = new Map<number, BookmarkItem[]>();
    for (const bm of bookmarks) {
      if (bm.rects && bm.rects.length > 0) {
        const list = map.get(bm.pageNumber);
        if (list) {
          list.push(bm);
        } else {
          map.set(bm.pageNumber, [bm]);
        }
      }
    }
    return map;
  }, [bookmarks]);

  const persistBookmarks = useCallback(
    (next: BookmarkItem[]) => {
      setBookmarksState(next);
      try {
        localStorage.setItem(bookmarksKey, JSON.stringify(next));
      } catch {
        // Ignora errori di quota
      }
    },
    [bookmarksKey]
  );

  const persistHighlightColors = useCallback(
    (next: HighlightColorConfig[]) => {
      setHighlightColorsState(next);
      try {
        localStorage.setItem(colorsKey, JSON.stringify(next));
      } catch {
        // Ignora errori di quota
      }
    },
    [colorsKey]
  );

  /**
   * Idrata segnalibri e colori evidenziatore con i dati caricati dal Cloud
   */
  const hydrateBookmarksData = useCallback(
    (
      cloudBookmarks: BookmarkItem[],
      cloudColors: HighlightColorConfig[]
    ) => {
      const validBookmarks = Array.isArray(cloudBookmarks)
        ? cloudBookmarks
        : [];
      const validColors = normalizeHighlightColors(cloudColors);
      setBookmarksState(validBookmarks);
      setHighlightColorsState(validColors);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(bookmarksKey, JSON.stringify(validBookmarks));
          localStorage.setItem(colorsKey, JSON.stringify(validColors));
        } catch {
          // Ignora errori di quota
        }
      }
    },
    [bookmarksKey, colorsKey]
  );

  // Crea un nuovo colore evidenziatore personalizzato con nome categoria e tinta scelta dall'utente
  const addHighlightColor = useCallback(
    (label: string, hex: string): HighlightColorConfig => {
      const trimmedLabel = label.trim() || "Nuova Categoria";
      const styles = buildColorStylesFromHex(hex);
      const newColor: HighlightColorConfig = {
        id: `custom-${Date.now()}`,
        label: trimmedLabel,
        hex: styles.hex,
        bgStyle: styles.bgStyle,
        borderStyle: styles.borderStyle,
        isCustom: true,
      };
      const updated = [...highlightColors, newColor];
      persistHighlightColors(updated);
      return newColor;
    },
    [highlightColors, persistHighlightColors]
  );

  // Rinomina o cambia la tinta di un colore evidenziatore esistente (inclusi i 4 colori base)
  const updateHighlightColorMeta = useCallback(
    (id: HighlightColor, updates: { label?: string; hex?: string }) => {
      const updated = highlightColors.map((c) => {
        if (c.id !== id) return c;
        const nextLabel =
          updates.label !== undefined
            ? updates.label.trim() || c.label
            : c.label;
        if (updates.hex !== undefined) {
          const styles = buildColorStylesFromHex(updates.hex);
          return {
            ...c,
            label: nextLabel,
            hex: styles.hex,
            bgStyle: styles.bgStyle,
            borderStyle: styles.borderStyle,
          };
        }
        return {
          ...c,
          label: nextLabel,
        };
      });
      persistHighlightColors(updated);
    },
    [highlightColors, persistHighlightColors]
  );

  // Elimina un colore personalizzato (riassegnando eventuali segnalibri che lo usavano al primo colore disponibile)
  const removeHighlightColor = useCallback(
    (id: HighlightColor) => {
      const target = highlightColors.find((c) => c.id === id);
      if (!target || !target.isCustom) return;
      const remaining = highlightColors.filter((c) => c.id !== id);
      const fallbackId = remaining[0]?.id ?? "yellow";
      persistHighlightColors(
        remaining.length > 0 ? remaining : DEFAULT_HIGHLIGHT_COLORS
      );

      // Se esistono segnalibri con il colore rimosso, li sposta sul colore di fallback
      const hasAffected = bookmarks.some((b) => b.color === id);
      if (hasAffected) {
        persistBookmarks(
          bookmarks.map((b) =>
            b.color === id ? { ...b, color: fallbackId } : b
          )
        );
      }
    },
    [highlightColors, bookmarks, persistHighlightColors, persistBookmarks]
  );

  // Ripristina i 4 colori base predefiniti mantenendo eventuali colori custom o resettando i nomi base
  const resetHighlightColors = useCallback(() => {
    persistHighlightColors(DEFAULT_HIGHLIGHT_COLORS);
  }, [persistHighlightColors]);

  // Verifica se la pagina intera ha un segnalibro di pagina (escludendo le singole evidenziazioni di testo/area)
  const isPageBookmarked = useCallback(
    (pageNumber: number) =>
      bookmarks.some(
        (item) =>
          item.pageNumber === pageNumber &&
          (!item.type || item.type === "page")
      ),
    [bookmarks]
  );

  // Attiva/disattiva il segnalibro per l'intera pagina corrente
  const toggleBookmark = useCallback(
    (pageNumber: number, chapterTitle?: string, customLabel?: string) => {
      const exists = bookmarks.some(
        (item) =>
          item.pageNumber === pageNumber &&
          (!item.type || item.type === "page")
      );
      if (exists) {
        const filtered = bookmarks.filter(
          (item) =>
            !(
              item.pageNumber === pageNumber &&
              (!item.type || item.type === "page")
            )
        );
        persistBookmarks(filtered);
        return false;
      } else {
        const newItem: BookmarkItem = {
          id: `bm-page-${pageNumber}-${Date.now()}`,
          pageNumber,
          type: "page",
          label:
            customLabel?.trim() || chapterTitle || `Pagina ${pageNumber}`,
          chapterTitle,
          createdAt: Date.now(),
        };
        const updated = [...bookmarks, newItem].sort(
          (a, b) => a.pageNumber - b.pageNumber || a.createdAt - b.createdAt
        );
        persistBookmarks(updated);
        return true;
      }
    },
    [bookmarks, persistBookmarks]
  );

  const focusHighlight = useCallback((id: string) => {
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
    }
    setFocusedHighlightId(id);
    focusTimerRef.current = setTimeout(() => {
      setFocusedHighlightId(null);
    }, 2400);
  }, []);

  // Aggiunge un segnalibro con evidenziazione specifica (testo selezionato o area disegnata)
  const addHighlightBookmark = useCallback(
    ({
      pageNumber,
      type,
      color,
      rects,
      highlightedText,
      label,
      chapterTitle,
    }: AddHighlightBookmarkInput) => {
      const cleanSnippet = highlightedText
        ?.replace(/\s+/g, " ")
        .trim();

      const colorCfg = getHighlightColorConfig(color, highlightColors);

      const autoLabel =
        label?.trim() ||
        (cleanSnippet
          ? cleanSnippet.length > 52
            ? `${cleanSnippet.slice(0, 52)}…`
            : cleanSnippet
          : `${colorCfg.label} (Pag. ${pageNumber})`);

      const newItem: BookmarkItem = {
        id: `bm-hl-${pageNumber}-${Date.now()}`,
        pageNumber,
        type,
        color,
        rects,
        highlightedText: cleanSnippet,
        label: autoLabel,
        chapterTitle,
        createdAt: Date.now(),
      };

      const updated = [...bookmarks, newItem].sort(
        (a, b) => a.pageNumber - b.pageNumber || a.createdAt - b.createdAt
      );
      persistBookmarks(updated);
      focusHighlight(newItem.id);
      return newItem;
    },
    [bookmarks, highlightColors, persistBookmarks, focusHighlight]
  );

  const removeBookmark = useCallback(
    (id: string) => {
      persistBookmarks(bookmarks.filter((item) => item.id !== id));
    },
    [bookmarks, persistBookmarks]
  );

  const updateBookmarkLabel = useCallback(
    (id: string, newLabel: string) => {
      const trimmed = newLabel.trim();
      if (!trimmed) return;
      persistBookmarks(
        bookmarks.map((item) =>
          item.id === id ? { ...item, label: trimmed } : item
        )
      );
    },
    [bookmarks, persistBookmarks]
  );

  const updateBookmarkColor = useCallback(
    (id: string, color: HighlightColor) => {
      persistBookmarks(
        bookmarks.map((item) =>
          item.id === id ? { ...item, color } : item
        )
      );
    },
    [bookmarks, persistBookmarks]
  );

  // Individua l'ultima evidenziazione creata in ordine cronologico per il tasto Back/Annulla multi-livello
  const lastHighlight = useMemo(() => {
    let latest: BookmarkItem | null = null;
    for (const bm of bookmarks) {
      if (bm.type === "text" || bm.type === "area") {
        if (!latest || bm.createdAt >= latest.createdAt) {
          latest = bm;
        }
      }
    }
    return latest;
  }, [bookmarks]);

  const canUndoHighlight = lastHighlight !== null;

  // Rimuove l'ultima evidenziazione effettuata (ripetibile a ritroso su tutta la cronologia di evidenziazioni)
  const undoLastHighlight = useCallback(() => {
    if (!lastHighlight) return null;
    const filtered = bookmarks.filter((item) => item.id !== lastHighlight.id);
    persistBookmarks(filtered);
    return lastHighlight;
  }, [bookmarks, lastHighlight, persistBookmarks]);

  return {
    bookmarks,
    highlightColors,
    hydrateBookmarksData,
    addHighlightColor,
    updateHighlightColorMeta,
    removeHighlightColor,
    resetHighlightColors,
    highlightsByPage,
    focusedHighlightId,
    focusHighlight,
    isPageBookmarked,
    toggleBookmark,
    addHighlightBookmark,
    removeBookmark,
    updateBookmarkLabel,
    updateBookmarkColor,
    lastHighlight,
    canUndoHighlight,
    undoLastHighlight,
  };
}
