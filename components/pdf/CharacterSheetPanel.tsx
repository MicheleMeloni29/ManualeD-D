"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  FileUp,
  FileDown,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  Shield,
  Sun,
  Moon,
  Check,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import type { CharacterSheetData } from "@/types/characterSheet";

const CharacterSheetPdfCanvas = dynamic(
  () => import("./CharacterSheetPdfCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-12">
        <Loader2 className="w-7 h-7 animate-spin opacity-60" />
        <p className="text-xs font-medium opacity-70">
          Caricamento scheda PDF editabile...
        </p>
      </div>
    ),
  }
);

export interface CharacterSheetPanelProps {
  isOpen: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  resolvedTheme: "light" | "dark" | "sepia";
  onSearchInManual: (term: string) => void;
  sheet: CharacterSheetData;
  pdfFieldValues: Record<string, string | boolean>;
  isImporting: boolean;
  isExporting: boolean;
  statusMessage: { type: "success" | "info" | "error"; text: string } | null;
  updatePdfField: (fieldName: string, value: string | boolean) => void;
  updateField: <K extends keyof CharacterSheetData>(
    key: K,
    value: CharacterSheetData[K]
  ) => void;
  performShortRest: () => void;
  performLongRest: () => void;
  importFromPdfFile: (file: File) => Promise<void>;
  exportToPdfFile: () => Promise<void>;
  resetSheet: () => void;
}

export function CharacterSheetPanel({
  isOpen,
  isExpanded,
  onToggleExpand,
  onClose,
  resolvedTheme,
  onSearchInManual,
  sheet,
  pdfFieldValues,
  isImporting,
  isExporting,
  statusMessage,
  updatePdfField,
  updateField,
  performShortRest,
  performLongRest,
  importFromPdfFile,
  exportToPdfFile,
  resetSheet,
}: CharacterSheetPanelProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(620);
  const [customZoom, setCustomZoom] = useState<number | null>(null);
  const [activeVisiblePage, setActiveVisiblePage] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Osserva la larghezza del contenitore per adattare automaticamente la scheda PDF A4
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateSize = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setContainerWidth(w);
      }
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen, isExpanded]);

  const fitWidth = Math.max(300, Math.min(1150, containerWidth - 28));
  const renderedPageWidth =
    customZoom !== null
      ? Math.round(595.28 * (customZoom / 100))
      : fitWidth;
  const currentZoomPct = Math.round((renderedPageWidth / 595.28) * 100);

  const handleZoomIn = () => {
    setCustomZoom(Math.min(220, currentZoomPct + 15));
  };

  const handleZoomOut = () => {
    setCustomZoom(Math.max(55, currentZoomPct - 15));
  };

  const handleFitWidth = () => {
    setCustomZoom(null);
  };

  const scrollToSheetPage = useCallback((pageNum: number) => {
    const target = pageRefs.current[pageNum];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveVisiblePage(pageNum);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollMid = container.scrollTop + container.clientHeight * 0.35;
    for (const p of [3, 2, 1]) {
      const el = pageRefs.current[p];
      if (el && el.offsetTop <= scrollMid) {
        setActiveVisiblePage(p);
        break;
      }
    }
  }, []);

  const handleUpdateImage = useCallback(
    (slot: "portraitImage" | "symbolImage", dataUrl: string) => {
      updateField(slot, dataUrl);
    },
    [updateField]
  );

  if (!isOpen) return null;

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const panelBg = isDark
    ? "bg-[#16110e] border-[#3d2d22] text-[#ede2d0]"
    : isSepia
    ? "bg-[#eadbc0] border-[#bfa682] text-[#2a180d]"
    : "bg-[#f8f3e8] border-[#d6c5a9] text-[#24160e]";

  const viewportBg = isDark
    ? "bg-[#0e0b09]"
    : isSepia
    ? "bg-[#d8c49e]"
    : "bg-[#e5dccb]";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importFromPdfFile(file);
    e.target.value = "";
  };

  return (
    <aside
      aria-label="Scheda Personaggio D&D 5e PDF"
      className={`${
        isExpanded
          ? "fixed inset-0 z-50 w-full h-dvh"
          : "fixed inset-0 z-40 w-full h-dvh lg:static lg:z-20 lg:w-[580px] xl:w-[680px] 2xl:w-[780px] lg:h-full lg:border-l"
      } flex flex-col overflow-hidden shadow-2xl transition-all duration-200 ${panelBg}`}
    >
      {/* Input file nascosto per Importa PDF */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* BARRA SUPERIORE COMPATTE DEL PANNELLO SCHEDA PDF */}
      <div className="shrink-0 px-3 py-2 border-b border-current/10 flex flex-wrap items-center justify-between gap-2 bg-black/5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold tracking-tight truncate">
              {sheet.characterName.trim() || "Scheda D&D 5e (PDF Editabile)"}
            </h2>
          </div>
        </div>

        {/* Pulsanti Azione: Importa PDF, Esporta PDF, Riposo Breve/Lungo, Reset, Espandi, Chiudi */}
        <div className="flex items-center flex-wrap gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            title="Importa una scheda PDF editabile compilata (es. Sennar.pdf)"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>{isImporting ? "Importo..." : "Importa PDF"}</span>
          </button>

          <button
            type="button"
            onClick={exportToPdfFile}
            disabled={isExporting}
            title="Scarica la scheda compilata nel formato PDF originale editabile a 3 pagine"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-current/20 hover:bg-current/10 transition cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExporting ? "Esporto..." : "Esporta PDF"}</span>
          </button>

          <button
            type="button"
            onClick={performShortRest}
            title="Riposo Breve (RB): ricarica gli usi dei privilegi con recupero RB"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border border-current/15 hover:bg-amber-500/15 hover:border-amber-500/40 transition cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">RB</span>
          </button>

          <button
            type="button"
            onClick={performLongRest}
            title="Riposo Lungo (RL): ripristina PF al massimo, azzera gli slot incantesimi spesi e ricarica i tratti RB/RL/Alba"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border border-current/15 hover:bg-indigo-500/15 hover:border-indigo-500/40 transition cursor-pointer"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">RL</span>
          </button>

          {confirmReset ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-600/20 border border-red-500/40 text-xs">
              <span className="text-[11px] font-semibold text-red-400">
                Resettare?
              </span>
              <button
                type="button"
                onClick={() => {
                  resetSheet();
                  setConfirmReset(false);
                }}
                className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold hover:bg-red-500 cursor-pointer"
              >
                Sì
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-1.5 py-0.5 rounded hover:bg-current/10 cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              title="Resetta la scheda a vuota"
              className="p-1.5 rounded-lg border border-current/15 hover:bg-red-500/15 hover:text-red-400 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onToggleExpand}
            title={
              isExpanded
                ? "Riduci a pannello affiancato al Manuale"
                : "Espandi la scheda a tutto schermo"
            }
            className="hidden lg:inline-flex p-1.5 rounded-lg border border-current/15 hover:bg-current/10 transition cursor-pointer"
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Chiudi scheda personaggio"
            className="p-1.5 rounded-lg border border-current/15 hover:bg-current/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SOTTO-BARRA: SALTO RAPIDO PAGINA 1 / 2 / 3 + CONTROLLI ZOOM PDF */}
      <div className="shrink-0 px-3 py-1.5 border-b border-current/10 flex items-center justify-between gap-2 bg-black/[0.03] text-xs">
        <div className="flex items-center gap-1">
          {[
            { p: 1, label: "Pag 1: Statistiche" },
            { p: 2, label: "Pag 2: Inventario" },
            { p: 3, label: "Pag 3: Incantesimi" },
          ].map(({ p, label }) => (
            <button
              key={p}
              type="button"
              onClick={() => scrollToSheetPage(p)}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                activeVisiblePage === p
                  ? "bg-amber-600 text-white shadow-xs"
                  : "hover:bg-current/10 opacity-75"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Controlli di Zoom del PDF */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Riduci zoom scheda"
            className="p-1 rounded hover:bg-current/10 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleFitWidth}
            title="Clicca per adattare alla larghezza del pannello"
            className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer ${
              customZoom === null
                ? "bg-amber-500/20 text-amber-500"
                : "hover:bg-current/10"
            }`}
          >
            {currentZoomPct}%
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Aumenta zoom scheda"
            className="p-1 rounded hover:bg-current/10 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* NOTIFICA TOAST (Import/Export/Riposo) */}
      {statusMessage && (
        <div
          className={`shrink-0 px-3 py-1.5 text-xs font-medium flex items-center gap-2 border-b ${
            statusMessage.type === "error"
              ? "bg-red-500/20 text-red-300 border-red-500/30"
              : statusMessage.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
          }`}
        >
          {statusMessage.type === "error" ? (
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Check className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* AREA SCORREVOLE CON LE 3 PAGINE GRAFICHE DEL PDF ORIGINALE */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-auto p-3 flex flex-col items-center ${viewportBg}`}
      >
        <CharacterSheetPdfCanvas
          renderedPageWidth={renderedPageWidth}
          pdfFieldValues={pdfFieldValues}
          portraitImage={sheet.portraitImage}
          symbolImage={sheet.symbolImage}
          onUpdatePdfField={updatePdfField}
          onUpdateImage={handleUpdateImage}
          onRequestReset={() => setConfirmReset(true)}
          onSearchInManual={onSearchInManual}
          pageRefs={pageRefs}
        />
      </div>
    </aside>
  );
}
