"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { OutlineItem, PageTextEntry, SearchMatch } from "@/types/pdf";
import { resolveChapterForPage } from "./usePdfNavigation";

export interface UsePdfSearchOptions {
  pagesText: PageTextEntry[];
  outline: OutlineItem[];
  onNavigateToPage: (pageNumber: number) => void;
}

/**
 * Effettua l'escape dei caratteri speciali RegExp
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Costruisce l'espressione regolare di ricerca tenendo conto dei caratteri accentati italiani
 */
export function buildSearchRegex(
  rawQuery: string,
  exactWord: boolean,
  caseSensitive: boolean
): RegExp | null {
  const trimmed = rawQuery.trim();
  if (!trimmed) return null;

  const escaped = escapeRegExp(trimmed);
  const flags = caseSensitive ? "gu" : "giu";

  if (exactWord) {
    // Usa lookbehind/lookahead Unicode per supportare lettere accentate (à, è, é, ì, ò, ù)
    return new RegExp(
      `(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`,
      flags
    );
  }

  return new RegExp(escaped, flags);
}

export function usePdfSearch({
  pagesText,
  outline,
  onNavigateToPage,
}: UsePdfSearchOptions) {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [exactWord, setExactWord] = useState<boolean>(false);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState<number>(0);

  // Debounce leggero (120ms) per mantenere l'input reattivo durante la digitazione
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 120);
    return () => clearTimeout(timer);
  }, [query]);

  // Calcola tutte le occorrenze su tutte le 321 pagine
  const matches = useMemo<SearchMatch[]>(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      return [];
    }

    const regex = buildSearchRegex(debouncedQuery, exactWord, caseSensitive);
    if (!regex) return [];

    const results: SearchMatch[] = [];
    let globalIdx = 0;

    for (const pageEntry of pagesText) {
      const { pageNumber, text } = pageEntry;
      if (!text) continue;

      regex.lastIndex = 0;
      let match: RegExpExecArray | null;
      let matchIndexInPage = 0;

      while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const matchedStr = match[0];
        const end = start + matchedStr.length;

        const snippetRadius = 55;
        const prefixStart = Math.max(0, start - snippetRadius);
        const suffixEnd = Math.min(text.length, end + snippetRadius);

        const snippetBefore =
          (prefixStart > 0 ? "…" : "") + text.slice(prefixStart, start);
        const snippetAfter =
          text.slice(end, suffixEnd) + (suffixEnd < text.length ? "…" : "");

        results.push({
          id: `p${pageNumber}-m${matchIndexInPage}-${globalIdx}`,
          pageNumber,
          matchIndexInPage,
          globalIndex: globalIdx,
          snippetBefore,
          matchText: matchedStr,
          snippetAfter,
          chapterTitle: resolveChapterForPage(outline, pageNumber),
        });

        matchIndexInPage++;
        globalIdx++;

        // Evita loop infiniti su match a lunghezza zero
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    }

    return results;
  }, [debouncedQuery, exactWord, caseSensitive, pagesText, outline]);

  // Quando cambiano i risultati, salta automaticamente al primo risultato
  useEffect(() => {
    if (matches.length > 0) {
      setActiveMatchIndex(0);
      onNavigateToPage(matches[0].pageNumber);
    } else {
      setActiveMatchIndex(0);
    }
  }, [matches, onNavigateToPage]);

  const activeMatch = useMemo<SearchMatch | null>(() => {
    if (matches.length === 0) return null;
    return matches[Math.min(activeMatchIndex, matches.length - 1)] ?? null;
  }, [matches, activeMatchIndex]);

  // Mappa veloce pageNumber -> numero di occorrenze sulla pagina
  const matchesByPage = useMemo(() => {
    const map = new Map<number, SearchMatch[]>();
    for (const m of matches) {
      const list = map.get(m.pageNumber);
      if (list) {
        list.push(m);
      } else {
        map.set(m.pageNumber, [m]);
      }
    }
    return map;
  }, [matches]);

  const pagesWithMatchesCount = useMemo(
    () => matchesByPage.size,
    [matchesByPage]
  );

  const selectMatch = useCallback(
    (index: number) => {
      if (matches.length === 0) return;
      const normalized =
        ((index % matches.length) + matches.length) % matches.length;
      setActiveMatchIndex(normalized);
      const target = matches[normalized];
      if (target) {
        onNavigateToPage(target.pageNumber);
      }
    },
    [matches, onNavigateToPage]
  );

  const nextMatch = useCallback(() => {
    selectMatch(activeMatchIndex + 1);
  }, [activeMatchIndex, selectMatch]);

  const prevMatch = useCallback(() => {
    selectMatch(activeMatchIndex - 1);
  }, [activeMatchIndex, selectMatch]);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setActiveMatchIndex(0);
  }, []);

  return {
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
    query,
    setQuery,
    debouncedQuery,
    exactWord,
    setExactWord,
    caseSensitive,
    setCaseSensitive,
    matches,
    matchesByPage,
    pagesWithMatchesCount,
    activeMatchIndex,
    activeMatch,
    selectMatch,
    nextMatch,
    prevMatch,
    clearSearch,
  };
}
