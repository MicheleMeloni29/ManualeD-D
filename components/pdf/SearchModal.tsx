"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
  WholeWord,
  CaseSensitive,
  ListFilter,
} from "lucide-react";
import type { SearchMatch } from "@/types/pdf";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  exactWord: boolean;
  onToggleExactWord: () => void;
  caseSensitive: boolean;
  onToggleCaseSensitive: () => void;
  matches: SearchMatch[];
  pagesWithMatchesCount: number;
  activeMatchIndex: number;
  onSelectMatch: (index: number) => void;
  onNextMatch: () => void;
  onPrevMatch: () => void;
  onClearSearch: () => void;
  resolvedTheme: "light" | "dark" | "sepia";
}

export function SearchModal({
  isOpen,
  onClose,
  query,
  onQueryChange,
  exactWord,
  onToggleExactWord,
  caseSensitive,
  onToggleCaseSensitive,
  matches,
  pagesWithMatchesCount,
  activeMatchIndex,
  onSelectMatch,
  onNextMatch,
  onPrevMatch,
  onClearSearch,
  resolvedTheme,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeItemRef = useRef<HTMLButtonElement | null>(null);
  const [showSnippetsList, setShowSnippetsList] = useState<boolean>(true);

  // Focus automatico all'apertura della barra di ricerca
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scorri automaticamente l'elemento attivo nella lista degli snippet
  useEffect(() => {
    if (showSnippetsList && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeMatchIndex, showSnippetsList]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        onPrevMatch();
      } else {
        onNextMatch();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const panelSurface =
    resolvedTheme === "dark"
      ? "bg-[#1a1411]/95 text-[#ede2d0] dnd-frame-dark"
      : resolvedTheme === "sepia"
      ? "bg-[#f3e5c8]/95 text-[#2a180d] dnd-frame-sepia"
      : "bg-[#fbf6eb]/95 text-[#24160e] dnd-frame-light";

  const activeDndToggle =
    "bg-[#8c1d14] text-[#fdf6e6] border-[#d4a74a] font-semibold";

  const trimmedQuery = query.trim();

  return (
    <div
      role="dialog"
      aria-label="Ricerca nel documento PDF"
      className={`fixed top-16 right-3 left-3 sm:left-auto sm:w-[390px] z-40 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col max-h-[calc(100dvh-9rem)] lg:max-h-[calc(100dvh-5.5rem)] transition-all duration-200 ${panelSurface}`}
    >
      {/* Barra Superiore di Input + Navigazione Occorrenze */}
      <div className="p-3 border-b border-[#c59b27]/35 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cerca parola o regola (es. Palla di Fuoco)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-black/5 dark:bg-white/5 border border-[#c59b27]/40 focus:border-[#8c1d14] dark:focus:border-[#d4a74a] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  onClearSearch();
                  inputRef.current?.focus();
                }}
                aria-label="Pulisci ricerca"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Pulsanti Precedente / Successivo tra i risultati */}
          <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/5 border border-[#c59b27]/30 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={onPrevMatch}
              disabled={matches.length === 0}
              aria-label="Risultato precedente"
              title="Risultato precedente (Shift+Invio)"
              className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNextMatch}
              disabled={matches.length === 0}
              aria-label="Risultato successivo"
              title="Risultato successivo (Invio)"
              className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi ricerca"
            title="Chiudi pannello ricerca (Esc)"
            className="p-2 rounded-xl opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Opzioni di Ricerca ("Parola esatta", "Maiuscole") + Contatore */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleExactWord}
              title="Cerca solo parola intera esatta"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border transition ${
                exactWord
                  ? activeDndToggle
                  : "border-[#c59b27]/35 opacity-75 hover:opacity-100"
              }`}
            >
              <WholeWord className="w-3.5 h-3.5" />
              <span>Parola esatta</span>
            </button>

            <button
              type="button"
              onClick={onToggleCaseSensitive}
              title="Distingui maiuscole e minuscole"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border transition ${
                caseSensitive
                  ? activeDndToggle
                  : "border-[#c59b27]/35 opacity-75 hover:opacity-100"
              }`}
            >
              <CaseSensitive className="w-3.5 h-3.5" />
              <span>Aa</span>
            </button>
          </div>

          {/* Stato Contatore + Toggle Lista Estratti */}
          <div className="flex items-center gap-2">
            {trimmedQuery.length >= 2 && (
              <span className="font-mono text-[11px] opacity-80">
                {matches.length > 0
                  ? `${activeMatchIndex + 1} di ${matches.length} (${pagesWithMatchesCount} pag.)`
                  : "0 risultati"}
              </span>
            )}

            {matches.length > 0 && (
              <button
                type="button"
                onClick={() => setShowSnippetsList((v) => !v)}
                title={
                  showSnippetsList
                    ? "Nascondi lista estratti (vista compatta)"
                    : "Mostra lista estratti di contesto"
                }
                className={`p-1 rounded-lg border transition ${
                  showSnippetsList
                    ? "border-[#c59b27]/50 bg-[#c59b27]/15"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista Espandibile degli Estratti Testuali (Snippets) */}
      {showSnippetsList && trimmedQuery.length >= 2 && (
        <div
          className={`flex-1 overflow-y-auto dnd-scrollbar-thin dnd-scrollbar-${resolvedTheme} p-2 space-y-1.5 max-h-[52vh] sm:max-h-[60vh]`}
        >
          {matches.length === 0 ? (
            <div className="py-8 px-4 text-center space-y-1 opacity-60">
              <p className="text-xs font-medium">
                Nessuna corrispondenza per &ldquo;{trimmedQuery}&rdquo;
              </p>
              <p className="text-[11px]">
                {exactWord
                  ? "Prova a disattivare il filtro 'Parola esatta' per includere parole parziali."
                  : "Verifica l'ortografia del termine cercato."}
              </p>
            </div>
          ) : (
            matches.map((match, idx) => {
              const isSelected = idx === activeMatchIndex;
              return (
                <button
                  key={match.id}
                  ref={isSelected ? activeItemRef : null}
                  type="button"
                  onClick={() => {
                    onSelectMatch(idx);
                    // Su mobile compatta automaticamente la lista quando si tocca un risultato per vedere subito la pagina
                    if (
                      typeof window !== "undefined" &&
                      window.innerWidth < 640
                    ) {
                      setShowSnippetsList(false);
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition flex flex-col gap-1 ${
                    isSelected
                      ? "border-[#8c1d14]/70 dark:border-[#d4a74a]/80 bg-[#8c1d14]/10 dark:bg-[#d4a74a]/10 shadow-xs"
                      : "border-[#c59b27]/30 hover:bg-[#c59b27]/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium opacity-70 truncate">
                      {match.chapterTitle || "Manuale del Giocatore"}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isSelected
                          ? "bg-[#8c1d14] text-[#fdf6e6] border border-[#d4a74a]/70"
                          : "bg-black/10 dark:bg-white/10"
                      }`}
                    >
                      Pag. {match.pageNumber}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed line-clamp-2 opacity-90">
                    <span>{match.snippetBefore}</span>
                    <mark className="px-1 py-0.5 rounded bg-amber-400/90 text-stone-950 font-semibold">
                      {match.matchText}
                    </mark>
                    <span>{match.snippetAfter}</span>
                  </p>
                </button>
              );
            })
          )}
        </div>
      )}

      {trimmedQuery.length > 0 && trimmedQuery.length < 2 && (
        <div className="p-3 text-center text-[11px] opacity-60">
          Digita almeno 2 caratteri per avviare la ricerca nelle 321 pagine.
        </div>
      )}
    </div>
  );
}
