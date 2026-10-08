"use client";

import React, { useState } from "react";
import {
  Highlighter,
  Plus,
  Trash2,
  X,
  Check,
  Edit3,
  Palette,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { HighlightColor, HighlightColorConfig } from "@/types/pdf";
import {
  PRESET_HIGHLIGHT_PALETTE,
  DND_CATEGORY_SUGGESTIONS,
  buildColorStylesFromHex,
} from "@/types/pdf";

export interface HighlightColorManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightColors: HighlightColorConfig[];
  activeHighlightColor: HighlightColor;
  onSelectHighlightColor: (color: HighlightColor) => void;
  onAddHighlightColor: (label: string, hex: string) => HighlightColorConfig;
  onUpdateHighlightColorMeta: (
    id: HighlightColor,
    updates: { label?: string; hex?: string }
  ) => void;
  onRemoveHighlightColor: (id: HighlightColor) => void;
  onResetHighlightColors: () => void;
  resolvedTheme: "light" | "dark" | "sepia";
}

export function HighlightColorManagerModal({
  isOpen,
  onClose,
  highlightColors,
  activeHighlightColor,
  onSelectHighlightColor,
  onAddHighlightColor,
  onUpdateHighlightColorMeta,
  onRemoveHighlightColor,
  onResetHighlightColors,
  resolvedTheme,
}: HighlightColorManagerModalProps) {
  const [newLabel, setNewLabel] = useState<string>("");
  const [newHex, setNewHex] = useState<string>("#fb923c");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>("");

  if (!isOpen) return null;

  const previewStyles = buildColorStylesFromHex(newHex);

  const handleCreateColor = (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackName =
      PRESET_HIGHLIGHT_PALETTE.find(
        (p) => p.hex.toLowerCase() === newHex.toLowerCase()
      )?.name || "Categoria Personalizzata";
    const created = onAddHighlightColor(newLabel.trim() || fallbackName, newHex);
    onSelectHighlightColor(created.id);
    setNewLabel("");
  };

  const handleSaveEdit = (id: HighlightColor) => {
    if (editingLabel.trim()) {
      onUpdateHighlightColorMeta(id, { label: editingLabel.trim() });
    }
    setEditingId(null);
    setEditingLabel("");
  };

  const modalSurface =
    resolvedTheme === "dark"
      ? "bg-[#1a1411]/98 text-[#ede2d0] dnd-frame-dark"
      : resolvedTheme === "sepia"
      ? "bg-[#f3e5c8]/98 text-[#2a180d] dnd-frame-sepia"
      : "bg-[#fbf6eb]/98 text-[#24160e] dnd-frame-light";

  const cardSurface =
    resolvedTheme === "dark"
      ? "bg-[#241c17] border-[#6e5023]/55"
      : resolvedTheme === "sepia"
      ? "bg-[#e9d9b7] border-[#b58938]/55"
      : "bg-[#f3ead8] border-[#c9a358]/55";

  const inputSurface =
    resolvedTheme === "dark"
      ? "bg-[#140f0c] border-[#785926] text-[#f5ebd9] placeholder:text-[#ede2d0]/40"
      : resolvedTheme === "sepia"
      ? "bg-[#fbf4e3] border-[#b88b3a] text-[#2a180d] placeholder:text-[#2a180d]/45"
      : "bg-[#fffdf8] border-[#c8a050] text-[#24160e] placeholder:text-[#24160e]/45";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label="Gestione colori e categorie evidenziatore"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg max-h-[88dvh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${modalSurface}`}
      >
        {/* Intestazione Modale */}
        <div className="px-4 py-3.5 border-b border-[#c59b27]/35 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#8c1d14]/15 dark:bg-[#d4a74a]/15 text-[#8c1d14] dark:text-[#e5be67]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                Colori e Categorie Evidenziatore
              </h2>
              <p className="text-[11px] opacity-70">
                Rinomina i colori o creane di nuovi per catalogare Azioni, Azioni Bonus, Incantesimi, ecc.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi finestra colori"
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo scorrevole con scrollbar a tema D&D */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-5 dnd-scrollbar-thin dnd-scrollbar-${resolvedTheme}`}
        >
          {/* SEZIONE 1: CREA NUOVO COLORE / CATEGORIA */}
          <form
            onSubmit={handleCreateColor}
            className={`p-3.5 rounded-xl border space-y-3 ${cardSurface}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#8c1d14] dark:text-[#e5be67]">
                <Plus className="w-3.5 h-3.5" />
                Nuovo Colore Evidenziatore
              </span>

              {/* Anteprima live dell'effetto evidenziatore */}
              <span
                style={{
                  backgroundColor: previewStyles.bgStyle,
                  borderColor: previewStyles.borderStyle,
                }}
                className="px-2 py-0.5 rounded text-[11px] font-semibold border shadow-2xs"
              >
                {newLabel.trim() || "Anteprima Testo"}
              </span>
            </div>

            {/* Input Nome Categoria + Selettore Colore Libero */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Nome categoria (es. Azioni Bonus, Incantesimi...)"
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-[#8c1d14]/60 ${inputSurface}`}
                />
              </div>

              {/* Selettore Colore Libero (HTML5 Color Picker) */}
              <label
                title="Scegli qualsiasi sfumatura con il selettore colore libero"
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer text-xs font-medium hover:opacity-95 transition ${inputSurface}`}
              >
                <span
                  style={{ backgroundColor: newHex }}
                  className="w-4 h-4 rounded-full border border-black/25 shadow-2xs shrink-0"
                />
                <span className="font-mono text-[11px] uppercase hidden sm:inline">
                  {newHex}
                </span>
                <input
                  type="color"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  className="sr-only"
                />
              </label>

              <button
                type="submit"
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#8c1d14] text-[#fdf6e6] border border-[#d4a74a]/80 hover:opacity-95 active:scale-95 transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Aggiungi</span>
              </button>
            </div>

            {/* Chip suggerimenti rapidi per categorie D&D */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-65 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Nomi categorie D&D suggeriti (clicca per compilare):
              </span>
              <div className="flex flex-wrap gap-1">
                {DND_CATEGORY_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setNewLabel(suggestion)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition ${
                      newLabel === suggestion
                        ? "bg-[#8c1d14] text-[#fdf6e6] border-[#d4a74a]"
                        : "border-current/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Palette rapida di tinte predefinite */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-65 block">
                Tinte consigliate ad alta leggibilità:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_HIGHLIGHT_PALETTE.map((preset) => {
                  const isSelected =
                    newHex.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setNewHex(preset.hex)}
                      title={`${preset.name} (${preset.hex})`}
                      style={{ backgroundColor: preset.hex }}
                      className={`w-6 h-6 rounded-full border border-black/25 transition-transform ${
                        isSelected
                          ? "scale-125 ring-2 ring-[#8c1d14] dark:ring-[#e5be67] shadow-md"
                          : "opacity-80 hover:opacity-100 hover:scale-110"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </form>

          {/* SEZIONE 2: ELENCO COLORI ATTIVI (RINOMINA, CAMBIA TINTA O ELIMINA) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <Highlighter className="w-3.5 h-3.5 text-[#8c1d14] dark:text-[#e5be67]" />
                I tuoi colori evidenziatore ({highlightColors.length})
              </span>

              <button
                type="button"
                onClick={onResetHighlightColors}
                title="Ripristina i 4 colori fluo predefiniti"
                className="text-[11px] font-medium opacity-65 hover:opacity-100 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ripristina base</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {highlightColors.map((c) => {
                const isActive = activeHighlightColor === c.id;
                const isEditing = editingId === c.id;

                return (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition ${
                      isActive
                        ? "border-[#8c1d14] dark:border-[#d4a74a] bg-[#8c1d14]/10 dark:bg-[#d4a74a]/12"
                        : `${cardSurface}`
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {/* Cliccando sul pallino colore si può cambiare anche la tinta di un colore esistente */}
                      <label
                        title="Clicca per cambiare la tonalità di questo evidenziatore"
                        className="relative cursor-pointer shrink-0 group"
                      >
                        <span
                          style={{
                            backgroundColor: c.hex,
                            boxShadow: `0 0 0 2px ${c.borderStyle}`,
                          }}
                          className="block w-6 h-6 rounded-full transition-transform group-hover:scale-110"
                        />
                        <input
                          type="color"
                          value={c.hex}
                          onChange={(e) =>
                            onUpdateHighlightColorMeta(c.id, {
                              hex: e.target.value,
                            })
                          }
                          className="sr-only"
                        />
                      </label>

                      {isEditing ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveEdit(c.id);
                          }}
                          className="flex items-center gap-1.5 flex-1 min-w-0"
                        >
                          <input
                            type="text"
                            value={editingLabel}
                            onChange={(e) => setEditingLabel(e.target.value)}
                            autoFocus
                            onBlur={() => handleSaveEdit(c.id)}
                            placeholder="Nome categoria..."
                            className={`flex-1 min-w-0 px-2.5 py-1 rounded-lg text-xs font-semibold border focus:outline-none ${inputSurface}`}
                          />
                          <button
                            type="submit"
                            title="Salva nome"
                            className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => onSelectHighlightColor(c.id)}
                            className="text-left min-w-0 flex-1 group"
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                style={{
                                  backgroundColor: c.bgStyle,
                                  borderColor: c.borderStyle,
                                }}
                                className="px-2 py-0.5 rounded-md text-xs font-semibold border truncate"
                              >
                                {c.label}
                              </span>
                              {isActive && (
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#8c1d14] text-[#fdf6e6]">
                                  In uso
                                </span>
                              )}
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Azioni rapide sul colore: Usa, Rinomina, Elimina (se custom) */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(c.id);
                            setEditingLabel(c.label);
                          }}
                          title="Rinomina questo colore (es. Azioni, Incantesimi...)"
                          className="px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 hover:bg-black/10 dark:hover:bg-white/10 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Rinomina</span>
                        </button>
                      )}

                      {c.isCustom && (
                        <button
                          type="button"
                          onClick={() => onRemoveHighlightColor(c.id)}
                          title="Elimina questo colore personalizzato"
                          className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/15 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#c59b27]/35 flex items-center justify-between text-xs">
          <span className="opacity-70 text-[11px]">
            Clicca su un pallino colore per cambiarne anche la tonalità
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-[#8c1d14] text-[#fdf6e6] border border-[#d4a74a]/80 hover:opacity-95 transition"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
