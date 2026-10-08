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

export type HighlightColor = "yellow" | "green" | "cyan" | "pink";

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

export const HIGHLIGHT_COLORS: {
  id: HighlightColor;
  label: string;
  swatchClass: string;
  bgStyle: string;
  borderStyle: string;
  badgeClass: string;
}[] = [
  {
    id: "yellow",
    label: "Giallo Fluo",
    swatchClass: "bg-[#facc15] ring-[#eab308]",
    bgStyle: "rgba(250, 204, 21, 0.42)",
    borderStyle: "rgba(234, 179, 8, 0.85)",
    badgeClass:
      "bg-yellow-400/25 text-yellow-800 dark:text-yellow-200 border-yellow-400/60",
  },
  {
    id: "green",
    label: "Verde Fluo",
    swatchClass: "bg-[#4ade80] ring-[#22c55e]",
    bgStyle: "rgba(74, 222, 128, 0.40)",
    borderStyle: "rgba(34, 197, 94, 0.85)",
    badgeClass:
      "bg-green-400/25 text-green-800 dark:text-green-200 border-green-400/60",
  },
  {
    id: "cyan",
    label: "Celeste Fluo",
    swatchClass: "bg-[#38bdf8] ring-[#0ea5e9]",
    bgStyle: "rgba(56, 189, 248, 0.38)",
    borderStyle: "rgba(14, 165, 233, 0.85)",
    badgeClass:
      "bg-sky-400/25 text-sky-800 dark:text-sky-200 border-sky-400/60",
  },
  {
    id: "pink",
    label: "Rosa Fluo",
    swatchClass: "bg-[#f472b6] ring-[#ec4899]",
    bgStyle: "rgba(244, 114, 182, 0.40)",
    borderStyle: "rgba(236, 72, 153, 0.85)",
    badgeClass:
      "bg-pink-400/25 text-pink-800 dark:text-pink-200 border-pink-400/60",
  },
];

export function getHighlightColorConfig(color?: HighlightColor) {
  return (
    HIGHLIGHT_COLORS.find((c) => c.id === color) ?? HIGHLIGHT_COLORS[0]
  );
}

export type ViewMode = "continuous" | "single" | "book";
export type ZoomMode = "fit-width" | "fit-page" | "custom";
export type ThemeMode = "system" | "light" | "dark" | "sepia";
