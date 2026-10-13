# DocuMerge — Technical Architecture & Implementation Documentation

## 1. Executive Architecture Overview

**DocuMerge** is an entirely client-side web application designed to concatenate, convert, and merge heterogeneous document formats (PDFs, spreadsheets, images, and text documents) directly inside the user's browser runtime. 

Unlike traditional document merge services that upload sensitive files to third-party cloud servers for processing with headless office engines, DocuMerge operates under a **Zero-Knowledge / Zero-Server Architecture**. All file parsing, binary manipulations, layout synthesis, and archive assemblies take place strictly within the browser's JavaScript execution thread using WebAssembly and client-side binary parser libraries.

```
+-----------------------------------------------------------------------------------+
|                                Client Browser Sandbox                             |
|                                                                                   |
|  +--------------------+        +---------------------+       +-----------------+  |
|  | File Upload Engine | -----> | Queue State Manager | ----> | Strategy Router |  |
|  | (DropZone / Input) |        | (Reorder / Validate)|       |  (Auto / Modes) |  |
|  +--------------------+        +---------------------+       +--------+--------+  |
|                                                                       |           |
|            +-------------------+--------------------+-----------------+           |
|            |                   |                    |                 |           |
|            v                   v                    v                 v           |
|     [ pdf-lib Engine ]   [ SheetJS Engine ]   [ Text Engine ]   [ Composite PDF ] |
|     (Vector / Binary)     (Binary Array)        (String/Blob)    (Raster + Vector)|
|            |                   |                    |                 |           |
|            +-------------------+--------------------+-----------------+           |
|                                        |                                          |
|                                        v                                          |
|                             [ Binary Blob Assembler ]                             |
|                                        |                                          |
|                                        v                                          |
|                             [ Stream Downloader ]                                 |
|                          (URL.createObjectURL -> Revoke)                          |
+-----------------------------------------------------------------------------------+
```

---

## 2. Technology Stack & Key Dependencies

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 19 (`react`, `react-dom`) | Modern reactive component hierarchy, declarative rendering pipeline, state handling. |
| **Language** | TypeScript (~6.0) | Strict typing across file schemas, byte arrays, and engine contracts. |
| **Build Tool** | Vite 8 + ES Modules | Fast Hot Module Replacement (HMR), tree-shaking, production bundling. |
| **Styling** | Vanilla CSS Modules | Clean encapsulation, zero CSS framework overhead, minimal bundle footprint. |
| **PDF Manipulation** | `pdf-lib` (v1.17.1) | Low-level PDF creation, page extraction, image embedding (PNG/JPG), and vector text rendering. |
| **Spreadsheet Engine** | `xlsx` / SheetJS (v0.18.5) | In-memory binary parsing and workbook generation for XLSX, XLS, and CSV. |
| **Docx Parser** | `mammoth` (v1.13.0) | Raw XML/HTML extraction from Word `.docx` packages for client-side processing. |
| **Icons** | `lucide-react` (v1.56.0) | Consistent, lightweight SVG icon system. |

---

## 3. Directory & File Structure

```
Docu-Merge/
├── public/
│   └── favicon.svg                    # Vector brand mark
├── src/
│   ├── components/
│   │   ├── DropZone.tsx               # Drag-and-drop & native input file ingestor
│   │   ├── DropZone.module.css        # Interactive hover/drag CSS rules
│   │   ├── FileIcon.tsx               # Format-aware badge and icon renderer
│   │   ├── FileList.tsx               # Reorderable queue with HTML5 drag events
│   │   ├── FileList.module.css        # Reordering animations & row states
│   │   ├── MergeButton.tsx            # Multi-state trigger (idle, loading, done, error)
│   │   ├── MergeButton.module.css     # Spinners and action button styles
│   │   ├── MergeOptions.tsx           # Merge strategy selection cards & filename input
│   │   └── MergeOptions.module.css    # Strategy grid layout
│   ├── utils/
│   │   ├── fileTypes.ts               # MIME/extension detection, file schema definitions
│   │   └── mergeEngines.ts            # Core binary transformation and merge routines
│   ├── App.tsx                        # Root orchestrator: state, routing, and UI lifecycle
│   ├── App.module.css                 # Main application layout, header, hero & footer styles
│   ├── index.css                      # Global design system, color tokens, typography
│   └── main.tsx                       # React DOM root initialization
├── index.html                         # Entry HTML with preloaded fonts and metadata
├── package.json                       # Dependencies, build scripts
├── tsconfig.app.json                  # TypeScript compiler settings
└── vite.config.ts                     # Vite build configuration
```

---

## 4. Core Subsystems & Implementation Details

### 4.1. File Classification & Queue Ingestion (`fileTypes.ts`)

Files passed via drag-and-drop or file pickers are wrapped in a typed `DocFile` data structure:

```typescript
export interface DocFile {
  id: string
  file: File
  name: string
  size: number
  type: DocType
  preview?: string
}
```

The `detectType(file: File)` heuristic maps files to one of six internal classifications:
- `'pdf'`: `application/pdf` or `.pdf`
- `'word'`: OpenXML/Word MIME types or `.docx`, `.doc`
- `'excel'`: Excel MIME types or `.xlsx`, `.xls`, `.csv`
- `'image'`: `image/*` or `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp`, `.svg`
- `'text'`: `text/plain` or `.txt`, `.md`
- `'unknown'`: Unrecognized MIME or binary extensions fallback

### 4.2. Merge Execution Pipelines (`mergeEngines.ts`)

#### A. PDF Engine (`mergePDFs`)
1. Instantiates an empty `PDFDocument` via `PDFDocument.create()`.
2. Iteratively reads each queued PDF's underlying buffer via `file.arrayBuffer()`.
3. Loads the source document using `PDFDocument.load(bytes)`.
4. Copies all source page indices using `merged.copyPages(src, src.getPageIndices())`.
5. Appends pages into the target document and serializes to a Uint8Array (`merged.save()`).
6. Wraps the byte array in a `Blob([pdfBytes], { type: 'application/pdf' })`.

#### B. Image-to-PDF Engine (`imagesPDF`)
1. Generates an empty `PDFDocument`.
2. Evaluates the MIME type of each image.
3. Decodes binary image data into native PDF image objects via `merged.embedPng(bytes)` or `merged.embedJpg(bytes)`.
4. Creates new pages sized exactly to `[img.width, img.height]` preserving original aspect ratios and DPI without clipping.
5. Draws the embedded image onto the page canvas at coordinates `(0, 0)`.

#### C. Spreadsheet Consolidation Engine (`mergeExcel`)
1. Creates an empty workbook using `XLSX.utils.book_new()`.
2. Reads incoming files via `XLSX.read(bytes, { type: 'array' })`.
3. Iterates across all sheets within each source document.
4. Generates unique sheet identifiers compliant with Excel’s 31-character sheet-name constraint by prefixing truncated source filenames:
   ```typescript
   const safeName = `${doc.name.replace(/\.[^.]+$/, '').slice(0, 20)}_${sheetName}`.slice(0, 31)
   ```
5. Appends individual sheets to the composite workbook using `XLSX.utils.book_append_sheet(...)`.
6. Compiles into an OpenXML `.xlsx` binary stream.

#### D. Text Concatenation Engine (`mergeText`)
1. Reads source files asynchronously using `file.text()`.
2. Prepends markdown headings (`# <Filename>`) to demarcate sections.
3. Merges parts using standard markdown separators (`\n\n---\n\n`).
4. Generates a clean UTF-8 text blob.

#### E. Mixed / Composite Engine (`mergeMixed`)
When documents of multiple types are submitted together, DocuMerge synthesizes a single unified PDF:
- Native PDFs have their vector pages copied directly.
- Raster images are embedded as full-page slides.
- Plain text documents are parsed into lines using word-wrapping logic and drawn onto standard A4 page dimensions with vector fonts (`page.drawText`).

### 4.3. Download & Memory Lifecycle

Browser memory leaks from generated binary objects are mitigated using programmatic download triggers followed by immediate cleanup:

```typescript
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url) // Immediate garbage collection enablement
}
```

---

## 5. Security & Privacy Guarantees

1. **Air-Gapped Operation Potential**: Once the application assets are loaded in the browser, the application can execute without an active internet connection.
2. **Zero Exfiltration**: No API endpoints, network requests, or tracking pixels handle document payloads.
3. **Sandbox Compliance**: Operates completely within the client browser's origin sandbox with no elevated filesystem permissions required.

---

## 6. Build & Development Commands

```bash
# Install dependencies
npm install

# Run local development server with Hot Module Replacement
npm run dev

# Run Oxlint static analysis
npm run lint

# Compile production-ready bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Extensibility Roadmap

- **Web Workers**: Offload high-resolution image decoding and 500+ page PDF parsing to background Web Workers to prevent main UI thread jank.
- **Client-Side Word Rendering**: Integrate `mammoth` HTML output with a client-side HTML-to-PDF canvas rasterizer for rich Word document conversion.
- **Client-Side Optical Character Recognition (OCR)**: Introduce optional `tesseract.js` workers to generate searchable PDFs from scanned images.
