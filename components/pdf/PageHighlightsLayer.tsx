"use client";

import React, { useState, useRef } from "react";
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
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(
    null
  );
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteInput, setNoteInput] = useState<string>("");

  // Stato per il disegno del rettangolo in modalità "Evidenziatore ad Area"
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragCurrent, setDragCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);

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
      setSelectedHighlightId(null);
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

    setDragStart(null);
    setDragCurrent(null);

    // Richiede una dimensione minima (> 1.2% della pagina) per evitare clic involontari
    if (width >= 1.2 && height >= 0.8) {
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
    }
  };

  const previewRect: NormalizedRect | null =
    dragStart && dragCurrent
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

  return (
    <div
      ref={layerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => {
        if (selectedHighlightId) {
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
        const firstRect = hl.rects[0];

        return (
          <React.Fragment key={hl.id}>
            {hl.rects.map((r, idx) => (
              <div
                key={`${hl.id}-r-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHighlightId(hl.id);
                  setNoteInput(hl.label);
                  setIsEditingNote(false);
                }}
                title={`[${cfg.label}] ${hl.label} — Clicca per modificare categoria, nota o eliminare`}
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

            {/* Mini-Popover contestuale quando l'utente clicca sull'evidenziazione sulla pagina */}
            {isSelected && firstRect && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  left: `${Math.min(75, Math.max(4, firstRect.x))}%`,
                  top: `${Math.max(2, firstRect.y - 1)}%`,
                  transform: "translateY(-100%)",
                }}
                className={`absolute z-30 pointer-events-auto rounded-xl border shadow-2xl backdrop-blur-md p-2 min-w-[220px] max-w-[280px] ${
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
                      onUpdateHighlightLabel(hl.id, noteInput);
                      setIsEditingNote(false);
                    }}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      autoFocus
                      placeholder="Nota segnalibro..."
                      className="flex-1 px-2 py-1 text-xs rounded bg-black/5 dark:bg-white/10 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          style={{
                            backgroundColor: cfg.bgStyle,
                            borderColor: cfg.borderStyle,
                          }}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0"
                        >
                          <span
                            style={{ backgroundColor: cfg.hex }}
                            className="w-1.5 h-1.5 rounded-full"
                          />
                          {cfg.label}
                        </span>
                        <span className="text-[11px] font-semibold truncate">
                          {hl.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedHighlightId(null)}
                        className="p-0.5 rounded opacity-60 hover:opacity-100 shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#c59b27]/35">
                      {/* Colori evidenziatore dinamici + pulsante "+" */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {highlightColors.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => onUpdateHighlightColor(hl.id, c.id)}
                            title={c.label}
                            style={{
                              backgroundColor: c.hex,
                              boxShadow:
                                hl.color === c.id
                                  ? `0 0 0 2px ${c.borderStyle}`
                                  : undefined,
                            }}
                            className={`w-4 h-4 rounded-full border border-black/20 transition-transform ${
                              hl.color === c.id
                                ? "scale-125"
                                : "opacity-65 hover:opacity-100"
                            }`}
                          />
                        ))}
                        {onOpenColorManager && (
                          <button
                            type="button"
                            onClick={onOpenColorManager}
                            title="Aggiungi o rinomina colori evidenziatore"
                            className="w-4 h-4 rounded-full border border-dashed border-current/45 flex items-center justify-center opacity-70 hover:opacity-100 hover:scale-110 transition"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsEditingNote(true)}
                          title="Modifica nota segnalibro"
                          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onRemoveHighlight(hl.id);
                            setSelectedHighlightId(null);
                          }}
                          title="Elimina evidenziazione"
                          className="p-1 rounded text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

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
