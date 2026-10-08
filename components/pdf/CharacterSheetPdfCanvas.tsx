"use client";

import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ImagePlus, Trash2, Search, Loader2 } from "lucide-react";
import {
  PDF_SHEET_PAGES_LAYOUT,
  type PdfFieldLayoutItem,
} from "@/lib/characterSheetPdfLayout";

// Configurazione client-side del worker PDF.js
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export interface CharacterSheetPdfCanvasProps {
  renderedPageWidth: number;
  pdfFieldValues: Record<string, string | boolean>;
  portraitImage?: string;
  symbolImage?: string;
  onUpdatePdfField: (fieldName: string, value: string | boolean) => void;
  onUpdateImage: (
    slot: "portraitImage" | "symbolImage",
    dataUrl: string
  ) => void;
  onRequestReset: () => void;
  onSearchInManual: (term: string) => void;
  pageRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

/**
 * Determina se un campo di testo del PDF può mostrare il pulsante rapido di ricerca nel Manuale (🔍)
 */
function isSearchablePdfField(fieldName: string, pageNumber: number): boolean {
  if (pageNumber === 3) {
    if (
      fieldName.startsWith("SlotsTotal") ||
      fieldName.startsWith("SlotsRemaining") ||
      fieldName === "SpellSaveDC  21" ||
      fieldName === "SpellAtkBonus 21" ||
      fieldName === "SpellcastingAbility 2"
    ) {
      return false;
    }
    return true;
  }
  if (pageNumber === 1) {
    return (
      fieldName === "ClassLevel" ||
      fieldName === "Race " ||
      fieldName === "Alignment" ||
      fieldName === "Talenti1" ||
      fieldName.startsWith("Wpn Name") ||
      fieldName.startsWith("Limited Feat")
    );
  }
  return false;
}

/**
 * Calcola la dimensione del font in pixel proporzionale alla scala corrente della pagina PDF A4 (595.28pt)
 */
function computeScaledFontSize(
  field: PdfFieldLayoutItem,
  scale: number
): number {
  const [, y1, , y2] = field.rect;
  const boxHeightPt = Math.max(8, y2 - y1);

  let fontPt = 10;
  if (field.multiLine) {
    fontPt = 9.2;
  } else if (boxHeightPt >= 24) {
    fontPt = Math.min(16, boxHeightPt * 0.52);
  } else if (boxHeightPt <= 11.5) {
    fontPt = Math.max(7.2, boxHeightPt * 0.76);
  } else {
    fontPt = Math.min(10.8, boxHeightPt * 0.64);
  }

  return Math.max(7, fontPt * scale);
}

export default function CharacterSheetPdfCanvas({
  renderedPageWidth,
  pdfFieldValues,
  portraitImage,
  symbolImage,
  onUpdatePdfField,
  onUpdateImage,
  onRequestReset,
  onSearchInManual,
  pageRefs,
}: CharacterSheetPdfCanvasProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const portraitInputRef = useRef<HTMLInputElement | null>(null);
  const symbolInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFileSelect = (
    slot: "portraitImage" | "symbolImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdateImage(slot, reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const triggerManualLookup = (rawText: string) => {
    const cleaned = rawText
      .split("\n")[0]
      .split(":")[0]
      .replace(/\(.*?\)/g, "")
      .trim();
    if (!cleaned || cleaned.toUpperCase() === "RITUALI") return;
    onSearchInManual(cleaned);
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-10 select-none">
      {/* Input nascosti per i riquadri immagine di Pagina 2 */}
      <input
        ref={portraitInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleImageFileSelect("portraitImage", e)}
        className="hidden"
      />
      <input
        ref={symbolInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleImageFileSelect("symbolImage", e)}
        className="hidden"
      />

      <Document
        file="/scheda-personaggio-vuota.pdf"
        loading={
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-amber-500">
            <Loader2 className="w-7 h-7 animate-spin" />
            <span className="text-xs font-semibold">
              Caricamento scheda PDF originale...
            </span>
          </div>
        }
        className="flex flex-col items-center gap-6"
      >
        {PDF_SHEET_PAGES_LAYOUT.map((pageLayout) => {
          const scale = renderedPageWidth / pageLayout.width;
          const renderedPageHeight = Math.round(pageLayout.height * scale);

          return (
            <div
              key={pageLayout.pageNumber}
              ref={(el) => {
                pageRefs.current[pageLayout.pageNumber] = el;
              }}
              style={{
                width: renderedPageWidth,
                height: renderedPageHeight,
              }}
              className="relative bg-white shadow-2xl rounded-sm overflow-hidden border border-black/20 shrink-0"
            >
              {/* Pagina grafica originale del PDF renderizzata su Canvas */}
              <Page
                pageNumber={pageLayout.pageNumber}
                width={renderedPageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={
                  <div
                    style={{
                      width: renderedPageWidth,
                      height: renderedPageHeight,
                    }}
                    className="bg-white flex items-center justify-center text-xs text-neutral-400"
                  >
                    Rendering Pagina {pageLayout.pageNumber}...
                  </div>
                }
              />

              {/* Layer interattivo millimetrico dei campi AcroForm della pagina */}
              <div className="absolute inset-0 z-10">
                {pageLayout.fields.map((field, idx) => {
                  const [x1, y1, x2, y2] = field.rect;
                  const leftPct = (x1 / pageLayout.width) * 100;
                  const topPct =
                    ((pageLayout.height - y2) / pageLayout.height) * 100;
                  const widthPct = ((x2 - x1) / pageLayout.width) * 100;
                  const heightPct = ((y2 - y1) / pageLayout.height) * 100;

                  const posStyle: React.CSSProperties = {
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                  };

                  // 1. Pulsante nativo "RESETTA LA SCHEDA" in Pagina 1
                  if (field.pushButton && field.name === "RESETTA LA SCHEDA") {
                    return (
                      <button
                        key={`${field.name}-${idx}`}
                        type="button"
                        onClick={onRequestReset}
                        title="Resetta tutti i campi della scheda"
                        style={posStyle}
                        className="absolute cursor-pointer rounded hover:bg-red-600/15 active:bg-red-600/25 transition"
                      />
                    );
                  }

                  // 2. Riquadri Immagine in Pagina 2 (Image1_af_image e Image2_af_image)
                  if (
                    field.pushButton &&
                    (field.name === "Image1_af_image" ||
                      field.name === "Image2_af_image")
                  ) {
                    const isPortrait = field.name === "Image1_af_image";
                    const imgDataUrl = isPortrait ? portraitImage : symbolImage;
                    const slotKey = isPortrait
                      ? "portraitImage"
                      : "symbolImage";
                    const inputRef = isPortrait
                      ? portraitInputRef
                      : symbolInputRef;

                    return (
                      <div
                        key={`${field.name}-${idx}`}
                        style={posStyle}
                        className="absolute group overflow-hidden flex items-center justify-center"
                      >
                        {imgDataUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgDataUrl}
                              alt={
                                isPortrait
                                  ? "Aspetto del personaggio"
                                  : "Simbolo"
                              }
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                title="Cambia immagine"
                                className="p-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow"
                              >
                                <ImagePlus className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateImage(slotKey, "")}
                                title="Rimuovi immagine"
                                className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 cursor-pointer shadow"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            title={
                              isPortrait
                                ? "Clicca per caricare l'immagine del personaggio"
                                : "Clicca per caricare il simbolo della fazione"
                            }
                            className="w-full h-full flex flex-col items-center justify-center gap-1 text-neutral-700/0 hover:text-neutral-800 hover:bg-amber-500/10 transition cursor-pointer"
                          >
                            <ImagePlus className="w-5 h-5 opacity-0 group-hover:opacity-75 transition" />
                            <span className="text-[10px] font-bold opacity-0 group-hover:opacity-75 transition px-2 text-center">
                              {isPortrait
                                ? "Carica Ritratto"
                                : "Carica Simbolo"}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  }

                  // 3. Checkbox / Pallini di Competenza, Maestria, Slot, TS Morte, Ispirazione
                  if (field.checkBox || field.type === "Btn") {
                    const checked = Boolean(pdfFieldValues[field.name]);
                    const isSquareBox =
                      field.name.startsWith("insp") ||
                      field.name === "Check Box 12";

                    return (
                      <button
                        key={`${field.name}-${idx}`}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        title={field.name}
                        onClick={() => onUpdatePdfField(field.name, !checked)}
                        style={posStyle}
                        className={`absolute flex items-center justify-center cursor-pointer transition ${
                          isSquareBox ? "rounded-[2px]" : "rounded-full"
                        } hover:ring-2 hover:ring-amber-500/60`}
                      >
                        {checked && (
                          <span
                            className={`w-[78%] h-[78%] bg-[#1a1615] ${
                              isSquareBox ? "rounded-[1px]" : "rounded-full"
                            }`}
                          />
                        )}
                      </button>
                    );
                  }

                  // 4. Campi di Testo (Single-line Input o Multi-line Textarea)
                  const rawVal = pdfFieldValues[field.name];
                  const textVal = typeof rawVal === "string" ? rawVal : "";
                  const fontSizePx = computeScaledFontSize(field, scale);
                  const isCentered =
                    field.align === 1 || field.name === "CharacterName";
                  const canSearch =
                    isSearchablePdfField(field.name, pageLayout.pageNumber) &&
                    textVal.trim().length >= 2 &&
                    textVal.trim().toUpperCase() !== "RITUALI";
                  const fieldKey = `${pageLayout.pageNumber}:${field.name}:${idx}`;
                  const isFocused = focusedField === fieldKey;

                  if (field.multiLine) {
                    return (
                      <div
                        key={fieldKey}
                        style={posStyle}
                        className="absolute group"
                      >
                        <textarea
                          value={textVal}
                          onFocus={() => setFocusedField(fieldKey)}
                          onBlur={() =>
                            setFocusedField((prev) =>
                              prev === fieldKey ? null : prev
                            )
                          }
                          onChange={(e) =>
                            onUpdatePdfField(field.name, e.target.value)
                          }
                          style={{
                            fontSize: `${fontSizePx}px`,
                            lineHeight: 1.2,
                          }}
                          className="w-full h-full bg-transparent hover:bg-amber-500/[0.06] focus:bg-amber-500/[0.10] text-[#111111] font-sans px-[2px] py-[1px] resize-none outline-none focus:ring-1 focus:ring-amber-600/60 rounded-[2px] overflow-y-auto"
                        />
                        {canSearch && (
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              triggerManualLookup(textVal);
                            }}
                            title="Cerca nel Manuale del Giocatore"
                            className={`absolute top-1 right-1 z-20 p-1 rounded bg-amber-600 text-white shadow hover:bg-amber-500 cursor-pointer transition ${
                              isFocused
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <Search className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={fieldKey}
                      style={posStyle}
                      className="absolute group flex items-center"
                    >
                      <input
                        type="text"
                        value={textVal}
                        onFocus={() => setFocusedField(fieldKey)}
                        onBlur={() =>
                          setFocusedField((prev) =>
                            prev === fieldKey ? null : prev
                          )
                        }
                        onChange={(e) =>
                          onUpdatePdfField(field.name, e.target.value)
                        }
                        style={{
                          fontSize: `${fontSizePx}px`,
                        }}
                        className={`w-full h-full bg-transparent hover:bg-amber-500/[0.08] focus:bg-amber-500/[0.14] text-[#111111] font-sans font-semibold px-[2px] outline-none focus:ring-1 focus:ring-amber-600/60 rounded-[2px] ${
                          isCentered ? "text-center" : "text-left"
                        }`}
                      />
                      {canSearch && (
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            triggerManualLookup(textVal);
                          }}
                          title={`Cerca "${textVal.trim()}" nel Manuale`}
                          className={`absolute right-0.5 z-20 p-0.5 rounded bg-amber-600 text-white shadow hover:bg-amber-500 cursor-pointer transition ${
                            isFocused
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Search className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Document>
    </div>
  );
}
