"use client";

import { useState, useEffect, useCallback } from "react";
import type { BookmarkItem } from "@/types/pdf";

const STORAGE_KEY_BOOKMARKS = "manuale_dnd_bookmarks_v1";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setBookmarks(parsed);
        }
      }
    } catch {
      // Ignora errori di parsing/storage
    }
  }, []);

  const persistBookmarks = useCallback((next: BookmarkItem[]) => {
    setBookmarks(next);
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(next));
    } catch {
      // Ignora errori di quota
    }
  }, []);

  const isPageBookmarked = useCallback(
    (pageNumber: number) =>
      bookmarks.some((item) => item.pageNumber === pageNumber),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (pageNumber: number, chapterTitle?: string, customLabel?: string) => {
      const exists = bookmarks.some((item) => item.pageNumber === pageNumber);
      if (exists) {
        const filtered = bookmarks.filter(
          (item) => item.pageNumber !== pageNumber
        );
        persistBookmarks(filtered);
        return false;
      } else {
        const newItem: BookmarkItem = {
          id: `bm-${pageNumber}-${Date.now()}`,
          pageNumber,
          label: customLabel?.trim() || chapterTitle || `Pagina ${pageNumber}`,
          chapterTitle,
          createdAt: Date.now(),
        };
        const updated = [...bookmarks, newItem].sort(
          (a, b) => a.pageNumber - b.pageNumber
        );
        persistBookmarks(updated);
        return true;
      }
    },
    [bookmarks, persistBookmarks]
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

  return {
    bookmarks,
    isPageBookmarked,
    toggleBookmark,
    removeBookmark,
    updateBookmarkLabel,
  };
}
