"use client";

import React from "react";
import { GripVertical } from "lucide-react";

export interface PanelResizeHandleProps {
  /** Identifica quale lato viene ridimensionato ("left" = Indice, "right" = Scheda Giocatore) */
  side: "left" | "right";
  label: string;
  currentWidth: number;
  minWidth: number;
  maxWidth: number;
  isDragging: boolean;
  resolvedTheme: "light" | "dark" | "sepia";
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onDoubleClick: () => void;
  onKeyboardNudge: (deltaPx: number) => void;
}

/**
 * Separatore verticale trascinabile (visibile solo su Desktop ≥ 1024px)
 * per regolare manualmente le larghezze di Indice, Manuale e Scheda Giocatore.
 */
export function PanelResizeHandle({
  side,
  label,
  currentWidth,
  minWidth,
  maxWidth,
  isDragging,
  resolvedTheme,
  onPointerDown,
  onDoubleClick,
  onKeyboardNudge,
}: PanelResizeHandleProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 48 : 16;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      // Per il pannello sinistro (Indice), freccia sinistra riduce; per quello destro (Scheda), freccia sinistra allarga
      onKeyboardNudge(side === "left" ? -step : step);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onKeyboardNudge(side === "left" ? step : -step);
    } else if (e.key === "Enter" || e.key === "Home") {
      e.preventDefault();
      onDoubleClick();
    }
  };

  const isDark = resolvedTheme === "dark";

  const pillClasses = isDragging
    ? "bg-[#8c1d14] text-[#fdf6e6] border-[#d4a74a] scale-105 opacity-100 shadow-md"
    : isDark
    ? "bg-[#221a15] text-[#d4a74a] border-[#c59b27]/45 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
    : "bg-[#f3e5c8] text-[#8c1d14] border-[#8c1d14]/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100";

  const lineClasses = isDragging
    ? "bg-[#d4a74a] opacity-100 w-[3px]"
    : "bg-[#c59b27]/0 group-hover:bg-[#c59b27]/75 group-focus-visible:bg-[#c59b27] w-[2px]";

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={currentWidth}
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      title={`${label} — Trascina per ridimensionare • Doppio clic per ripristinare`}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
      className="hidden lg:flex group relative z-30 w-2.5 -mx-1.25 shrink-0 cursor-col-resize items-center justify-center select-none touch-none focus:outline-none"
    >
      {/* Linea verticale luminosa lungo tutto il bordo */}
      <div
        aria-hidden="true"
        className={`h-full transition-all duration-150 ${lineClasses}`}
      />

      {/* Impugnatura centrale con icona Grip */}
      <div
        aria-hidden="true"
        className={`absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center py-2 px-0.5 rounded-full border transition-all duration-150 pointer-events-none ${pillClasses}`}
      >
        <GripVertical className="w-3 h-3" />
      </div>

      {/* Badge larghezza in tempo reale durante il trascinamento */}
      {isDragging && (
        <div
          aria-hidden="true"
          className={`absolute top-4 ${
            side === "left" ? "left-4" : "right-4"
          } px-2 py-0.5 rounded-md text-[11px] font-mono font-bold whitespace-nowrap pointer-events-none shadow-lg border ${
            isDark
              ? "bg-[#1a1411]/95 text-[#e5be67] border-[#d4a74a]/60"
              : "bg-[#24160e]/95 text-[#fdf6e6] border-[#d4a74a]/60"
          }`}
        >
          {currentWidth}px
        </div>
      )}
    </div>
  );
}
