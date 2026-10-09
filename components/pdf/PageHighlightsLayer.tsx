"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { Trash2, Edit3, Check, X, Plus } from "lucide-react";
import type {
  BookmarkItem,
  HighlightColor,
  HighlightColorConfig,
  NormalizedRect,
} from "@/types/pdf";
import { getHighlightColorConfig } from "@/types/pdf";

export interface PageHighlightsLayerProps {
  pageNumber: number;
  highlights: BookmarkItem[];
  highlightColors: HighlightColorConfig[];
  focusedHighlightId: string | null;
  isAreaHighlightMode: boolean;
  activeHighlightColor: HighlightColor;
  onCreateAreaHighlight: (
    pageNumber: number,
    rect: NormalizedRect,
    color: HighlightColor
  ) => void;
  onUpdateHighlightColor: (id: string, color: HighlightColor) => void;
  onUpdateHighlightLabel: (id: string, label: string) => void;
  onRemoveHighlight: (id: string) => void;
  onOpenColorManager?: () => void;
  resolvedTheme: "light" | "dark" | "sepia";
}

export function PageHighlightsLayer({
  pageNumber,
  highlights,
  highlightColors,
  focusedHighlightId,
  isAreaHighlightMode,
  activeHighlightColor,
  onCreateAreaHighlight,
  onUpdateHighlightColor,
  onUpdateHighlightLabel,
  onRemoveHighlight,
  onOpenColorManager,
  resolvedTheme,
}: PageHighlightsLayerProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(
    null
  );
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteInput, setNoteInput] = useState<string>("");
  const [popoverPos, setPopoverPos] = useState<{
    left: number;
    top: number;
  } | null>(null);

  // Stato per il disegno del rettangolo in modalità "Evidenziatore ad Area"
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragCurrent, setDragCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const selectedHighlight =
    highlights.find((h) => h.id === selectedHighlightId) ?? null;

  const commitNoteEdit = useCallback(
    (id: string, value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        onUpdateHighlightLabel(id, trimmed);
      }
      setIsEditingNote(false);
    },
    [onUpdateHighlightLabel]
  );

  // Calcola la posizione del PopUp vincolata al 100% dentro i bordi visibili dello schermo (Viewport-Clamped)
  const updatePopoverPosition = useCallback(() => {
    if (
      !selectedHighlight ||
      !selectedHighlight.rects ||
      selectedHighlight.rects.length === 0
    ) {
      setPopoverPos(null);
      return;
    }

    const layerEl = layerRef.current;
    if (!layerEl || typeof window === "undefined") return;

    const pageRect = layerEl.getBoundingClientRect();
    if (pageRect.width <= 0 || pageRect.height <= 0) return;

    const minX = Math.min(...selectedHighlight.rects.map((r) => r.x));
    const maxX = Math.max(
      ...selectedHighlight.rects.map((r) => r.x + r.width)
    );
    const minY = Math.min(...selectedHighlight.rects.map((r) => r.y));
    const maxY = Math.max(
      ...selectedHighlight.rects.map((r) => r.y + r.height)
    );

    const hlLeft = pageRect.left + (minX / 100) * pageRect.width;
    const hlRight = pageRect.left + (maxX / 100) * pageRect.width;
    const hlTop = pageRect.top + (minY / 100) * pageRect.height;
    const hlBottom = pageRect.top + (maxY / 100) * pageRect.height;
    const hlCenterX = (hlLeft + hlRight) / 2;

    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const vOffsetLeft = window.visualViewport?.offsetLeft ?? 0;
    const vOffsetTop = window.visualViewport?.offsetTop ?? 0;

    const popRect = popoverRef.current?.getBoundingClientRect();
    const popWidth =
      popRect && popRect.width > 0 ? popRect.width : Math.min(276, vw - 24);
    const popHeight = popRect && popRect.height > 0 ? popRect.height : 92;

    const SAFE_MARGIN_X = 12;
    const minLeft = vOffsetLeft + SAFE_MARGIN_X;
    const maxLeft = Math.max(
      minLeft,
      vOffsetLeft + vw - popWidth - SAFE_MARGIN_X
    );
    const clampedLeft = Math.round(
      Math.max(minLeft, Math.min(maxLeft, hlCenterX - popWidth / 2))
    );

    // Margini verticali sicuri (tiene conto della Top Bar da 56px e della Bottom Bar mobile)
    const isMobileViewport = window.innerWidth < 1024;
    const SAFE_TOP = vOffsetTop + 64;
    const SAFE_BOTTOM = vOffsetTop + vh - (isMobileViewport ? 72 : 16);
    const GAP = 8;

    const aboveTop = hlTop - popHeight - GAP;
    const belowTop = hlBottom + GAP;

    let clampedTop: number;
    if (aboveTop >= SAFE_TOP) {
      // C'è spazio sopra l'area evidenziata
      clampedTop = Math.min(SAFE_BOTTOM - popHeight, aboveTop);
    } else if (belowTop + popHeight <= SAFE_BOTTOM) {
      // Troppo vicino al bordo superiore: si apre automaticamente sotto l'area evidenziata
      clampedTop = Math.max(SAFE_TOP, belowTop);
    } else {
      // Area molto estesa: mantieni il PopUp ancorato nella zona visibile senza mai uscire dallo schermo
      clampedTop = Math.max(
        SAFE_TOP,
        Math.min(SAFE_BOTTOM - popHeight, Math.max(SAFE_TOP, hlTop + 8))
      );
    }

    setPopoverPos({
      left: clampedLeft,
      top: Math.round(Math.max(vOffsetTop + 8, clampedTop)),
    });
  }, [selectedHighlight]);

  useLayoutEffect(() => {
    updatePopoverPosition();
  }, [
    updatePopoverPosition,
    selectedHighlightId,
    isEditingNote,
    highlightColors.length,
  ]);

  useEffect(() => {
    if (!selectedHighlightId) return;

    const handleViewportUpdate = () => {
      updatePopoverPosition();
    };

    window.addEventListener("scroll", handleViewportUpdate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", handleViewportUpdate);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", handleViewportUpdate);
    vv?.addEventListener("scroll", handleViewportUpdate);

    return () => {
      window.removeEventListener("scroll", handleViewportUpdate, {
        capture: true,
      });
      window.removeEventListener("resize", handleViewportUpdate);
      vv?.removeEventListener("resize", handleViewportUpdate);
      vv?.removeEventListener("scroll", handleViewportUpdate);
    };
  }, [selectedHighlightId, updatePopoverPosition]);

  // Chiude il PopUp quando si tocca/clicca fuori da esso (salvando eventuali modifiche in corso)
  useEffect(() => {
    if (!selectedHighlightId) return;

    const handleGlobalPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      if (target.closest("[data-highlight-id]")) {
        return;
      }
      // Se siamo in modalità evidenziatore ad area, handlePointerUp gestirà il tap/drag
      if (
        isAreaHighlightMode &&
        layerRef.current &&
        layerRef.current.contains(target)
      ) {
        return;
      }

      if (isEditingNote) {
        commitNoteEdit(selectedHighlightId, noteInput);
      }
      setSelectedHighlightId(null);
      setIsEditingNote(false);
    };

    document.addEventListener("pointerdown", handleGlobalPointerDown);
    return () => {
      document.removeEventListener("pointerdown", handleGlobalPointerDown);
    };
  }, [
    selectedHighlightId,
    isEditingNote,
    noteInput,
    isAreaHighlightMode,
    commitNoteEdit,
  ]);

  // Calcola coordinate percentuali (0..100) rispetto alla pagina PDF
  const getRelativePercentCoords = (clientX: number, clientY: number) => {
    const el = layerRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    const x = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((clientY - rect.top) / rect.height) * 100)
    );
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAreaHighlightMode) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;

    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const coords = getRelativePercentCoords(e.clientX, e.clientY);
    if (coords) {
      setDragStart(coords);
      setDragCurrent(coords);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAreaHighlightMode || !dragStart) return;
    e.stopPropagation();
    const coords = getRelativePercentCoords(e.clientX, e.clientY);
    if (coords) {
      setDragCurrent(coords);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAreaHighlightMode || !dragStart || !dragCurrent) return;
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignora
    }

    const x = Math.min(dragStart.x, dragCurrent.x);
    const y = Math.min(dragStart.y, dragCurrent.y);
    const width = Math.abs(dragCurrent.x - dragStart.x);
    const height = Math.abs(dragCurrent.y - dragStart.y);

    const tapX = dragStart.x;
    const tapY = dragStart.y;

    setDragStart(null);
    setDragCurrent(null);

    // Richiede una dimensione minima (> 1.2% della pagina) per creare un nuovo riquadro
    if (width >= 1.2 && height >= 0.8) {
      if (isEditingNote && selectedHighlightId) {
        commitNoteEdit(selectedHighlightId, noteInput);
      }
      setSelectedHighlightId(null);
      setIsEditingNote(false);
      onCreateAreaHighlight(
        pageNumber,
        {
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          width: Number(width.toFixed(2)),
          height: Number(height.toFixed(2)),
        },
        activeHighlightColor
      );
      return;
    }

    // Se l'utente ha fatto un semplice tap senza trascinare mentre lo strumento è attivo,
    // verifica se ha toccato un'area già evidenziata per aprire il suo PopUp
    const hitHighlight = [...highlights].reverse().find((hl) =>
      hl.rects?.some(
        (r) =>
          tapX >= r.x &&
          tapX <= r.x + r.width &&
          tapY >= r.y &&
          tapY <= r.y + r.height
      )
    );

    if (hitHighlight) {
      if (
        isEditingNote &&
        selectedHighlightId &&
        selectedHighlightId !== hitHighlight.id
      ) {
        commitNoteEdit(selectedHighlightId, noteInput);
      }
      setSelectedHighlightId(hitHighlight.id);
      setNoteInput(hitHighlight.label);
      setIsEditingNote(false);
    } else {
      if (isEditingNote && selectedHighlightId) {
        commitNoteEdit(selectedHighlightId, noteInput);
      }
      setSelectedHighlightId(null);
      setIsEditingNote(false);
    }
  };

  const previewRect: NormalizedRect | null =
    dragStart &&
    dragCurrent &&
    (Math.abs(dragCurrent.x - dragStart.x) >= 1.2 ||
      Math.abs(dragCurrent.y - dragStart.y) >= 0.8)
      ? {
          x: Math.min(dragStart.x, dragCurrent.x),
          y: Math.min(dragStart.y, dragCurrent.y),
          width: Math.abs(dragCurrent.x - dragStart.x),
          height: Math.abs(dragCurrent.y - dragStart.y),
        }
      : null;

  const activeColorConfig = getHighlightColorConfig(
    activeHighlightColor,
    highlightColors
  );

  const selectedCfg = selectedHighlight
    ? getHighlightColorConfig(selectedHighlight.color, highlightColors)
    : null;

  return (
    <div
      ref={layerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => {
        if (!isAreaHighlightMode && selectedHighlightId) {
          if (isEditingNote) {
            commitNoteEdit(selectedHighlightId, noteInput);
          }
          setSelectedHighlightId(null);
          setIsEditingNote(false);
        }
      }}
      className={`absolute inset-0 z-15 ${
        isAreaHighlightMode
          ? "cursor-crosshair pointer-events-auto select-none touch-none"
          : "pointer-events-none"
      }`}
    >
      {/* Evidenziazioni salvate sulla pagina */}
      {highlights.map((hl) => {
        if (!hl.rects || hl.rects.length === 0) return null;
        const cfg = getHighlightColorConfig(hl.color, highlightColors);
        const isFocused = focusedHighlightId === hl.id;
        const isSelected = selectedHighlightId === hl.id;

        return (
          <React.Fragment key={hl.id}>
            {hl.rects.map((r, idx) => (
              <div
                key={`${hl.id}-r-${idx}`}
                data-highlight-id={hl.id}
                onClick={(e) => {
                  if (isAreaHighlightMode) return;
                  e.stopPropagation();
                  if (
                    isEditingNote &&
                    selectedHighlightId &&
                    selectedHighlightId !== hl.id
                  ) {
                    commitNoteEdit(selectedHighlightId, noteInput);
                  }
                  setSelectedHighlightId(hl.id);
                  setNoteInput(hl.label);
                  setIsEditingNote(false);
                }}
                title={`[${cfg.label}] ${hl.label} — Tocca per modificare categoria, nome o eliminare`}
                style={{
                  left: `${r.x}%`,
                  top: `${r.y}%`,
                  width: `${r.width}%`,
                  height: `${r.height}%`,
                  backgroundColor: cfg.bgStyle,
                  boxShadow:
                    isFocused || isSelected
                      ? `0 0 0 2px ${cfg.borderStyle}, 0 4px 14px rgba(0,0,0,0.22)`
                      : hl.type === "area"
                      ? `inset 0 0 0 1.5px ${cfg.borderStyle}`
                      : undefined,
                  mixBlendMode:
                    resolvedTheme === "dark" ? "screen" : "multiply",
                }}
                className={`absolute rounded-[3px] pointer-events-auto cursor-pointer transition-all duration-200 ${
                  isFocused ? "animate-pulse scale-[1.01]" : ""
                }`}
              />
            ))}
          </React.Fragment>
        );
      })}

      {/* Mini-Popover contestuale renderizzato in Portal e vincolato ai bordi dello schermo */}
      {selectedHighlight &&
        selectedCfg &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{
              left: popoverPos ? `${popoverPos.left}px` : "12px",
              top: popoverPos ? `${popoverPos.top}px` : "64px",
              visibility: popoverPos ? "visible" : "hidden",
            }}
            className={`fixed z-50 pointer-events-auto rounded-xl border shadow-2xl backdrop-blur-md p-2.5 w-[min(280px,calc(100vw-24px))] select-none ${
              resolvedTheme === "dark"
                ? "bg-[#1b1512]/95 text-[#ede2d0] dnd-frame-dark"
                : resolvedTheme === "sepia"
                ? "bg-[#f2e4c6]/95 text-[#2a180d] dnd-frame-sepia"
                : "bg-[#fbf6eb]/95 text-[#24160e] dnd-frame-light"
            }`}
          >
            {isEditingNote ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  commitNoteEdit(selectedHighlight.id, noteInput);
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onBlur={() => commitNoteEdit(selectedHighlight.id, noteInput)}
                  autoFocus
                  placeholder="Nome area o nota..."
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-[16px] sm:text-xs rounded-lg bg-black/8 dark:bg-white/10 border border-[#c59b27]/45 focus:border-[#8c1d14] dark:focus:border-[#d4a74a] focus:outline-none"
                />
                <button
                  type="submit"
                  onMouseDown={(e) => e.preventDefault()}
                  title="Salva nome"
                  aria-label="Salva nome"
                  className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setNoteInput(selectedHighlight.label);
                    setIsEditingNote(false);
                  }}
                  title="Annulla modifica"
                  aria-label="Annulla modifica"
                  className="p-1.5 rounded-lg opacity-65 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span
                      style={{
                        backgroundColor: selectedCfg.bgStyle,
                        borderColor: selectedCfg.borderStyle,
                      }}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0"
                    >
                      <span
                        style={{ backgroundColor: selectedCfg.hex }}
                        className="w-1.5 h-1.5 rounded-full"
                      />
                      {selectedCfg.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNoteInput(selectedHighlight.label);
                        setIsEditingNote(true);
                      }}
                      title="Tocca per rinominare questa evidenziazione"
                      className="text-xs font-semibold truncate text-left hover:underline flex-1 min-w-0 py-0.5"
                    >
                      {selectedHighlight.label}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHighlightId(null);
                      setIsEditingNote(false);
                    }}
                    aria-label="Chiudi menu evidenziazione"
                    className="p-1 rounded-lg opacity-65 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#c59b27]/35">
                  {/* Colori evidenziatore dinamici + pulsante "+" */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {highlightColors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          onUpdateHighlightColor(selectedHighlight.id, c.id)
                        }
                        title={c.label}
                        aria-label={`Cambia colore in ${c.label}`}
                        style={{
                          backgroundColor: c.hex,
                          boxShadow:
                            selectedHighlight.color === c.id
                              ? `0 0 0 2px ${c.borderStyle}`
                              : undefined,
                        }}
                        className={`w-5 h-5 rounded-full border border-black/20 transition-transform ${
                          selectedHighlight.color === c.id
                            ? "scale-120"
                            : "opacity-70 hover:opacity-100"
                        }`}
                      />
                    ))}
                    {onOpenColorManager && (
                      <button
                        type="button"
                        onClick={onOpenColorManager}
                        title="Aggiungi o rinomina colori evidenziatore"
                        aria-label="Gestisci colori evidenziatore"
                        className="w-5 h-5 rounded-full border border-dashed border-current/45 flex items-center justify-center opacity-75 hover:opacity-100 hover:scale-110 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setNoteInput(selectedHighlight.label);
                        setIsEditingNote(true);
                      }}
                      title="Rinomina o modifica nota"
                      aria-label="Rinomina evidenziazione"
                      className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onRemoveHighlight(selectedHighlight.id);
                        setSelectedHighlightId(null);
                        setIsEditingNote(false);
                      }}
                      title="Elimina evidenziazione"
                      aria-label="Elimina evidenziazione"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 active:scale-95 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}

      {/* Rettangolo di anteprima live mentre si traccia un'area col mouse o dito */}
      {previewRect && (
        <div
          style={{
            left: `${previewRect.x}%`,
            top: `${previewRect.y}%`,
            width: `${previewRect.width}%`,
            height: `${previewRect.height}%`,
            backgroundColor: activeColorConfig.bgStyle,
            border: `2px dashed ${activeColorConfig.borderStyle}`,
          }}
          className="absolute rounded-xs pointer-events-none"
        />
      )}
    </div>
  );
}

