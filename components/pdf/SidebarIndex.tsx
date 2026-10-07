"use client";

import React, { useState, useMemo } from "react";
import {
  BookMarked,
  ChevronDown,
  ChevronRight,
  ListTree,
  Plus,
  Search,
  Trash2,
  X,
  Edit3,
  Check,
} from "lucide-react";
import type { BookmarkItem, OutlineItem } from "@/types/pdf";

export interface SidebarIndexProps {
  isOpen: boolean;
  onClose: () => void;
  outline: OutlineItem[];
  currentPage: number;
  activeChapter?: string;
  onSelectPage: (pageNumber: number) => void;
  bookmarks: BookmarkItem[];
  isCurrentPageBookmarked: boolean;
  onToggleCurrentPageBookmark: () => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkLabel: (id: string, label: string) => void;
  resolvedTheme: "light" | "dark" | "sepia";
}

export function SidebarIndex({
  isOpen,
  onClose,
  outline,
  currentPage,
  activeChapter,
  onSelectPage,
  bookmarks,
  isCurrentPageBookmarked,
  onToggleCurrentPageBookmark,
  onRemoveBookmark,
  onUpdateBookmarkLabel,
  resolvedTheme,
}: SidebarIndexProps) {
  const [activeTab, setActiveTab] = useState<"outline" | "bookmarks">(
    "outline"
  );
  const [filterText, setFilterText] = useState<string>("");
  const [collapsedTitles, setCollapsedTitles] = useState<
    Record<string, boolean>
  >({});
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(
    null
  );
  const [editingLabel, setEditingLabel] = useState<string>("");

  const toggleCollapse = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedTitles((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Filtra l'albero dei capitoli se l'utente digita nel campo filtro
  const filteredOutline = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return outline;

    function filterNodes(nodes: OutlineItem[]): OutlineItem[] {
      const res: OutlineItem[] = [];
      for (const node of nodes) {
        const childMatches = filterNodes(node.items || []);
        const selfMatches = node.title.toLowerCase().includes(q);
        if (selfMatches || childMatches.length > 0) {
          res.push({
            ...node,
            items: selfMatches && childMatches.length === 0 ? node.items : childMatches,
          });
        }
      }
      return res;
    }

    return filterNodes(outline);
  }, [outline, filterText]);

  const handlePageJump = (pageNumber: number) => {
    onSelectPage(pageNumber);
    // Su mobile chiudiamo automaticamente il drawer dopo la selezione
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onClose();
    }
  };

  const startEditing = (bm: BookmarkItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBookmarkId(bm.id);
    setEditingLabel(bm.label);
  };

  const saveEditing = (id: string, e: React.FormEvent | React.MouseEvent) => {
    e.stopPropagation();
    onUpdateBookmarkLabel(id, editingLabel);
    setEditingBookmarkId(null);
  };

  if (!isOpen) return null;

  const panelBg =
    resolvedTheme === "dark"
      ? "bg-zinc-900 border-zinc-800 text-zinc-100"
      : resolvedTheme === "sepia"
      ? "bg-[#f4ecd8] border-[#dfcfb0] text-stone-900"
      : "bg-white border-stone-200 text-stone-900";

  return (
    <>
      {/* Backdrop su Mobile */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs animate-in fade-in"
      />

      {/* Drawer su Mobile / Sidebar laterale su Desktop */}
      <aside
        aria-label="Indice del libro e segnalibri"
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-20 w-[85vw] max-w-[320px] md:w-80 shrink-0 border-r flex flex-col h-full transition-colors select-none ${panelBg}`}
      >
        {/* Header Sidebar con Tab Switcher */}
        <div className="p-3 border-b border-current/10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 flex-1 mr-2">
              <button
                type="button"
                onClick={() => setActiveTab("outline")}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeTab === "outline"
                    ? "bg-stone-800 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>Capitoli</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bookmarks")}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeTab === "bookmarks"
                    ? "bg-stone-800 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Segnalibri</span>
                {bookmarks.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300">
                    {bookmarks.length}
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi pannello indice"
              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filtro rapido per l'indice dei capitoli */}
          {activeTab === "outline" && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-45" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filtra capitolo, razza, classe..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 border border-transparent focus:border-stone-400 dark:focus:border-zinc-600 focus:outline-none"
              />
              {filterText && (
                <button
                  type="button"
                  onClick={() => setFilterText("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Contenuto Scrollabile */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {activeTab === "outline" ? (
            filteredOutline.length === 0 ? (
              <div className="py-12 px-4 text-center text-xs opacity-60">
                Nessuna sezione trovata per &ldquo;{filterText}&rdquo;.
              </div>
            ) : (
              filteredOutline.map((chapter) => {
                const hasSubItems =
                  chapter.items && chapter.items.length > 0;
                const isCollapsed =
                  !filterText && Boolean(collapsedTitles[chapter.title]);
                const isChapterActive = activeChapter === chapter.title;

                return (
                  <div key={`${chapter.title}-${chapter.pageNumber}`} className="space-y-0.5">
                    <div
                      onClick={() => handlePageJump(chapter.pageNumber)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlePageJump(chapter.pageNumber);
                        }
                      }}
                      className={`group flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                        isChapterActive
                          ? "bg-stone-800 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {hasSubItems ? (
                          <button
                            type="button"
                            onClick={(e) => toggleCollapse(chapter.title, e)}
                            aria-label="Espandi o comprimi sezione"
                            className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
                          >
                            {isCollapsed ? (
                              <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            )}
                          </button>
                        ) : (
                          <span className="w-4 shrink-0" />
                        )}
                        <span className="truncate">{chapter.title}</span>
                      </div>

                      <span
                        className={`font-mono text-[11px] px-1.5 py-0.5 rounded-md shrink-0 ${
                          isChapterActive
                            ? "bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900"
                            : "opacity-55 group-hover:opacity-90"
                        }`}
                      >
                        {chapter.pageNumber}
                      </span>
                    </div>

                    {/* Sottocapitoli */}
                    {hasSubItems && !isCollapsed && (
                      <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l border-current/10 ml-4">
                        {chapter.items.map((sub) => {
                          const isSubActive = activeChapter === sub.title;
                          return (
                            <button
                              key={`${sub.title}-${sub.pageNumber}`}
                              type="button"
                              onClick={() => handlePageJump(sub.pageNumber)}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition ${
                                isSubActive
                                  ? "bg-stone-800/90 text-white dark:bg-zinc-200 dark:text-zinc-900 font-semibold"
                                  : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                              }`}
                            >
                              <span className="truncate">{sub.title}</span>
                              <span className="font-mono text-[10px] opacity-60 shrink-0">
                                {sub.pageNumber}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )
          ) : (
            /* TAB SEGNALIBRI PERSONALI */
            <div className="space-y-3 p-1">
              <button
                type="button"
                onClick={onToggleCurrentPageBookmark}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  isCurrentPageBookmarked
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                    : "border-dashed border-current/25 hover:border-current/50 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isCurrentPageBookmarked
                    ? `Rimuovi Pagina ${currentPage} dai segnalibri`
                    : `Salva Pagina ${currentPage} nei segnalibri`}
                </span>
              </button>

              {bookmarks.length === 0 ? (
                <div className="py-10 px-4 text-center space-y-2 opacity-60">
                  <BookMarked className="w-7 h-7 mx-auto opacity-50" />
                  <p className="text-xs font-medium">
                    Nessun segnalibro salvato
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Salva le pagine che consulti più spesso (es. tabelle armi,
                    incantesimi o regole di combattimento) per tornarci con un
                    clic.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {bookmarks.map((bm) => {
                    const isCurrent = bm.pageNumber === currentPage;
                    const isEditing = editingBookmarkId === bm.id;

                    return (
                      <div
                        key={bm.id}
                        onClick={() =>
                          !isEditing && handlePageJump(bm.pageNumber)
                        }
                        className={`group p-2.5 rounded-xl border transition cursor-pointer ${
                          isCurrent
                            ? "border-amber-500/50 bg-amber-500/10"
                            : "border-current/10 hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          {isEditing ? (
                            <form
                              onSubmit={(e) => saveEditing(bm.id, e)}
                              className="flex items-center gap-1 flex-1"
                            >
                              <input
                                type="text"
                                value={editingLabel}
                                onChange={(e) =>
                                  setEditingLabel(e.target.value)
                                }
                                autoFocus
                                className="flex-1 px-2 py-1 text-xs rounded bg-black/10 dark:bg-white/10 focus:outline-none"
                              />
                              <button
                                type="submit"
                                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-emerald-600 dark:text-emerald-400"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          ) : (
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate">
                                {bm.label}
                              </p>
                              {bm.chapterTitle &&
                                bm.chapterTitle !== bm.label && (
                                  <p className="text-[11px] opacity-60 truncate mt-0.5">
                                    {bm.chapterTitle}
                                  </p>
                                )}
                            </div>
                          )}

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                              Pag. {bm.pageNumber}
                            </span>
                            {!isEditing && (
                              <button
                                type="button"
                                onClick={(e) => startEditing(bm, e)}
                                title="Rinomina segnalibro"
                                className="p-1 rounded opacity-0 group-hover:opacity-70 hover:!opacity-100 hover:bg-black/10 dark:hover:bg-white/10"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveBookmark(bm.id);
                              }}
                              title="Elimina segnalibro"
                              className="p-1 rounded opacity-0 group-hover:opacity-70 hover:!opacity-100 hover:text-red-500 hover:bg-black/10 dark:hover:bg-white/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
