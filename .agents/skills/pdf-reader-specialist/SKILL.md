---
name: pdf-reader-specialist
description: >-
  Architettura e linee guida specifiche per il lettore interattivo di manuali D&D basato su react-pdf v11, PDF.js, Next.js 16.4 (cacheComponents + Turbopack), ricerca full-text Unicode e gestione vista a pagina singola/doppia.
  Use this skill whenever working on the manuale_dnd project, including PDF rendering, zoom/spread navigation, full-text search, outline/bookmarks, or PDF metadata.
---

# Manuale D&D — PDF Reader Specialist (`react-pdf` v11 & Next.js 16.4)

Questa skill definisce le regole architetturali e di performance per lavorare sul progetto **manuale_dnd**.

## 1. Isolamento SSR del Motore PDF.js (`react-pdf` v11)

> [!CAUTION]
> `react-pdf` e `pdfjs-dist` utilizzano API esclusive del browser (`DOMMatrix`, `HTMLCanvasElement`, `Web Worker`). Importare `react-pdf` o `PdfViewer.tsx` direttamente in un Server Component o senza disabilitare SSR causa il crash immediato di Next.js 16 in fase di build/SSR.

1. **Importazione Dinamica Obbligatoria**:
   - `components/pdf/PdfViewer.tsx` deve essere importato **esclusivamente** tramite `next/dynamic` con `{ ssr: false }` all'interno di `components/pdf/PdfReaderApp.tsx`.
   - Il worker di PDF.js deve essere configurato esclusivamente lato client dentro `PdfViewer.tsx`.
2. **Configurazione Next.js 16.4 (`next.config.ts`)**:
   - Il progetto utilizza `cacheComponents: true`, `partialPrefetching: true` e `@tailwindcss/turbopack`. Prima di modificare API di Next.js 16.4, consulta `node_modules/next/dist/docs/` come indicato in `AGENTS.md`.

---

## 2. Architettura Modulare del Lettore (Hooks & Componenti)

Mantieni una netta separazione delle responsabilità tra i 4 hook principali in `hooks/` e i componenti UI in `components/pdf/`:

1. **Navigazione, Zoom e Spread (`hooks/usePdfNavigation.ts`)**:
   - Gestisce pagina corrente (`currentPage`), modalità vista (`single` vs `continuous`, e affiancamento a doppia pagina `isTwoPageSpread` / `spreadPages`), e modalità di zoom (`fit-page`, `fit-width`, `custom`).
   - Le dimensioni predefinite del manuale (`DEFAULT_PDF_WIDTH = 612`, `DEFAULT_PDF_HEIGHT = 792`) servono per calcolare la scala ottimale senza layout shift prima del caricamento della pagina.
2. **Ricerca Full-Text con Supporto Accenti Italiani (`hooks/usePdfSearch.ts` + `components/pdf/SearchModal.tsx`)**:
   - La ricerca opera in memoria sui testi pre-estratti da `public/pdf-metadata.json` (`pagesText` su tutte le 321 pagine) con debounce a `120ms`.
   - Quando modifichi la logica di matching o evidenziazione, usa sempre espressioni regolari Unicode (`u` flag, `(?<![\p{L}\p{N}_])...(?![\p{L}\p{N}_])`) per supportare correttamente le lettere accentate italiane (`à, è, é, ì, ò, ù`).
3. **Indice Capitoli e Segnalibri (`hooks/useBookmarks.ts` + `components/pdf/SidebarIndex.tsx`)**:
   - L'albero dei capitoli (`OutlineItem[]`) viene caricato da `public/pdf-metadata.json` (con fallback sull'outline interno del PDF).
   - I segnalibri utente sono salvati in `localStorage` tramite `useBookmarks.ts`. Assicurati che ogni accesso a `localStorage` sia protetto per evitare errori in SSR/hydration.

---

## 3. Regole di Performance sul Rendering delle Pagine PDF
- Non renderizzare mai tutte le 321 pagine contemporaneamente nel DOM: in modalità continua (`continuous`), mantieni la virtualizzazione/windowing renderizzando solo le pagine visibili nel viewport più un buffer ridotto, utilizzando placeholder con le dimensioni scalate esatte per le altre pagine.
- Scrivi sempre commenti e JSDoc in **italiano**.
