export interface OutlineItem {
  title: string;
  pageNumber: number;
  items: OutlineItem[];
}

export interface PageTextEntry {
  pageNumber: number;
  text: string;
}

export interface PdfMetadata {
  numPages: number;
  pageWidth: number;
  pageHeight: number;
  outline: OutlineItem[];
  pagesText: PageTextEntry[];
}

export interface SearchMatch {
  id: string;
  pageNumber: number;
  matchIndexInPage: number;
  globalIndex: number;
  snippetBefore: string;
  matchText: string;
  snippetAfter: string;
  chapterTitle?: string;
}

export type HighlightColor = string;

export interface HighlightColorConfig {
  id: HighlightColor;
  label: string;
  hex: string;
  bgStyle: string;
  borderStyle: string;
  isCustom?: boolean;
}

/**
 * Converte un colore esadecimale (#RRGGBB) negli stili RGBA semitrasparenti per l'evidenziatore sul PDF
 */
export function buildColorStylesFromHex(hex: string): {
  hex: string;
  bgStyle: string;
  borderStyle: string;
} {
  const clean = hex.trim().replace(/^#/, "");
  let r = 250;
  let g = 204;
  let b = 21;

  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  } else if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  }

  const normalizedHex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return {
    hex: normalizedHex,
    bgStyle: `rgba(${r}, ${g}, ${b}, 0.40)`,
    borderStyle: `rgba(${r}, ${g}, ${b}, 0.88)`,
  };
}

/**
 * Coordinate normalizzate in percentuale (0..100) rispetto alla pagina PDF,
 * indipendenti dal livello di zoom o dalla risoluzione dello schermo.
 */
export interface NormalizedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BookmarkItem {
  id: string;
  pageNumber: number;
  label: string;
  chapterTitle?: string;
  createdAt: number;
  type?: "page" | "text" | "area";
  color?: HighlightColor;
  highlightedText?: string;
  rects?: NormalizedRect[];
}

export const DEFAULT_HIGHLIGHT_COLORS: HighlightColorConfig[] = [
  {
    id: "yellow",
    label: "Giallo Fluo",
    hex: "#facc15",
    bgStyle: "rgba(250, 204, 21, 0.42)",
    borderStyle: "rgba(234, 179, 8, 0.88)",
    isCustom: false,
  },
  {
    id: "green",
    label: "Verde Fluo",
    hex: "#4ade80",
    bgStyle: "rgba(74, 222, 128, 0.40)",
    borderStyle: "rgba(34, 197, 94, 0.88)",
    isCustom: false,
  },
  {
    id: "cyan",
    label: "Celeste Fluo",
    hex: "#38bdf8",
    bgStyle: "rgba(56, 189, 248, 0.38)",
    borderStyle: "rgba(14, 165, 233, 0.88)",
    isCustom: false,
  },
  {
    id: "pink",
    label: "Rosa Fluo",
    hex: "#f472b6",
    bgStyle: "rgba(244, 114, 182, 0.40)",
    borderStyle: "rgba(236, 72, 153, 0.88)",
    isCustom: false,
  },
];

export const HIGHLIGHT_COLORS = DEFAULT_HIGHLIGHT_COLORS;

/**
 * Palette rapida di tinte evidenziatore consigliate quando l'utente crea un nuovo colore
 */
export const PRESET_HIGHLIGHT_PALETTE: {
  hex: string;
  name: string;
}[] = [
  { hex: "#fb923c", name: "Arancione" },
  { hex: "#a855f7", name: "Viola Arcano" },
  { hex: "#ef4444", name: "Rosso Cremisi" },
  { hex: "#eab308", name: "Oro Antico" },
  { hex: "#14b8a6", name: "Turchese" },
  { hex: "#84cc16", name: "Verde Lime" },
  { hex: "#6366f1", name: "Indaco" },
  { hex: "#f43f5e", name: "Corallo" },
  { hex: "#facc15", name: "Giallo Fluo" },
  { hex: "#4ade80", name: "Verde Fluo" },
  { hex: "#38bdf8", name: "Celeste Fluo" },
  { hex: "#f472b6", name: "Rosa Fluo" },
];

/**
 * Suggerimenti rapidi di categorie D&D per nominare i colori dell'evidenziatore
 */
export const DND_CATEGORY_SUGGESTIONS: string[] = [
  "Azioni",
  "Azioni Bonus",
  "Reazioni",
  "Incantesimi",
  "Privilegi di Classe",
  "Talenti",
  "Equipaggiamento",
  "Regole Chiave",
];

export function getHighlightColorConfig(
  color?: HighlightColor,
  customColors: HighlightColorConfig[] = DEFAULT_HIGHLIGHT_COLORS
): HighlightColorConfig {
  return (
    customColors.find((c) => c.id === color) ??
    DEFAULT_HIGHLIGHT_COLORS.find((c) => c.id === color) ??
    customColors[0] ??
    DEFAULT_HIGHLIGHT_COLORS[0]
  );
}

export type ViewMode = "continuous" | "single" | "book";
export type ZoomMode = "fit-width" | "fit-page" | "custom";
export type ThemeMode = "system" | "light" | "dark" | "sepia";
