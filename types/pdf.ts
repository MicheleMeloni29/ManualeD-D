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

export interface BookmarkItem {
  id: string;
  pageNumber: number;
  label: string;
  chapterTitle?: string;
  createdAt: number;
}

export type ViewMode = "continuous" | "single" | "book";
export type ZoomMode = "fit-width" | "fit-page" | "custom";
export type ThemeMode = "system" | "light" | "dark" | "sepia";
