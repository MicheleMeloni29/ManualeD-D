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
  NormalizedRect,
} from "@/types/pdf";

const STORAGE_KEY_BOOKMARKS = "manuale_dnd_bookmarks_v1";

function loadInitialBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
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

export function useBookmarks() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [bookmarksState, setBookmarksState] =
    useState<BookmarkItem[]>(loadInitialBookmarks);

  // ID dell'evidenziazione temporaneamente messa in risalto (pulse) dopo un clic dalla sidebar
  const [focusedHighlightId, setFocusedHighlightId] = useState<string | null>(
    null
  );
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bookmarks = useMemo(
    () => (isHydrated ? bookmarksState : []),
    [isHydrated, bookmarksState]
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

  const persistBookmarks = useCallback((next: BookmarkItem[]) => {
    setBookmarksState(next);
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(next));
    } catch {
      // Ignora errori di quota
    }
  }, []);

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

      const autoLabel =
        label?.trim() ||
        (cleanSnippet
          ? cleanSnippet.length > 52
            ? `${cleanSnippet.slice(0, 52)}…`
            : cleanSnippet
          : `Area evidenziata (Pag. ${pageNumber})`);

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
    [bookmarks, persistBookmarks, focusHighlight]
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
