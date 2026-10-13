# DocuMerge 📄✨

> A clean, private, client-side document merging application for PDFs, spreadsheets, images, and text.

![DocuMerge Preview](./public/favicon.svg)

## Features

- 🔒 **100% Client-Side & Private**: Your files are processed entirely in your web browser. Nothing is ever uploaded to a server.
- ⚡ **Lightning Fast**: Zero server upload/download wait times.
- 📁 **Universal Support**: Merge PDFs, spreadsheets (`.xlsx`, `.xls`, `.csv`), images (`.png`, `.jpg`, `.webp`), and text notes (`.txt`, `.md`).
- 🎨 **Minimalist Design**: Clean white workspace with intuitive drag-and-drop reordering.
- ⚙️ **Smart Merge Strategies**: Auto-detects the right format or lets you choose specialized PDF, Excel, image, or mixed workflows.

---

## 📚 Documentation

Detailed documentation is available for both technical contributors and everyday users:

- 📖 **[User Manual & Practical Guide](file:///c:/Users/Emma/Desktop/GITHUB/Docu-Merge/USER_MANUAL.md)**  
  A non-technical, step-by-step walkthrough of features, workflows, and best practices with a gentle touch of how it works under the hood.

- 🛠️ **[Technical Architecture Documentation](file:///c:/Users/Emma/Desktop/GITHUB/Docu-Merge/TECHNICAL_DOCUMENTATION.md)**  
  Comprehensive developer documentation covering the zero-server architecture, binary manipulation engines (`pdf-lib`, `SheetJS`), state management, data pipelines, and security model.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm or pnpm

### Installation

```bash
# Clone or navigate to the directory
cd Docu-Merge

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5174` (or the port indicated by Vite) in your web browser.

### Building for Production

```bash
npm run build
```

The optimized static assets will be output to the `dist/` folder and can be hosted on GitHub Pages, Vercel, Netlify, or any static file host.
