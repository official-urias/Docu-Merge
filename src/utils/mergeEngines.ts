import { PDFDocument } from 'pdf-lib'
import * as XLSX from 'xlsx'
import type { DocFile } from './fileTypes'

// ── PDF Merge ─────────────────────────────────────────────────
export async function mergePDFs(docs: DocFile[]): Promise<Blob> {
  const merged = await PDFDocument.create()

  for (const doc of docs) {
    const bytes = await doc.file.arrayBuffer()
    const src = await PDFDocument.load(bytes)
    const pages = await merged.copyPages(src, src.getPageIndices())
    pages.forEach(p => merged.addPage(p))
  }

  const pdfBytes = await merged.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

// ── Images → PDF ──────────────────────────────────────────────
export async function imagesPDF(docs: DocFile[]): Promise<Blob> {
  const merged = await PDFDocument.create()

  for (const doc of docs) {
    const bytes = await doc.file.arrayBuffer()
    let img
    if (doc.file.type === 'image/png') {
      img = await merged.embedPng(bytes)
    } else {
      img = await merged.embedJpg(bytes)
    }
    const page = merged.addPage([img.width, img.height])
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
  }

  const pdfBytes = await merged.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

// ── Text → single TXT ────────────────────────────────────────
export async function mergeText(docs: DocFile[], separator: string = '\n\n---\n\n'): Promise<Blob> {
  const parts: string[] = []
  for (const doc of docs) {
    const text = await doc.file.text()
    parts.push(`# ${doc.name}\n\n${text}`)
  }
  return new Blob([parts.join(separator)], { type: 'text/plain' })
}

// ── Excel → merged workbook ───────────────────────────────────
export async function mergeExcel(docs: DocFile[]): Promise<Blob> {
  const workbook = XLSX.utils.book_new()

  for (const doc of docs) {
    const bytes = await doc.file.arrayBuffer()
    const src = XLSX.read(bytes, { type: 'array' })
    src.SheetNames.forEach(sheetName => {
      const sheet = src.Sheets[sheetName]
      const safeName = `${doc.name.replace(/\.[^.]+$/, '').slice(0, 20)}_${sheetName}`.slice(0, 31)
      XLSX.utils.book_append_sheet(workbook, sheet, safeName)
    })
  }

  const out = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  return new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

// ── Mixed → PDF (best-effort, text & images) ─────────────────
export async function mergeMixed(docs: DocFile[]): Promise<Blob> {
  const merged = await PDFDocument.create()

  for (const doc of docs) {
    const bytes = await doc.file.arrayBuffer()

    if (doc.type === 'pdf') {
      const src = await PDFDocument.load(bytes)
      const pages = await merged.copyPages(src, src.getPageIndices())
      pages.forEach(p => merged.addPage(p))
    } else if (doc.type === 'image') {
      let img
      try {
        if (doc.file.type === 'image/png') {
          img = await merged.embedPng(bytes)
        } else {
          img = await merged.embedJpg(bytes)
        }
        const page = merged.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      } catch {
        // skip unsupported image format
      }
    } else if (doc.type === 'text') {
      const text = await doc.file.text()
      const page = merged.addPage()
      const { width, height } = page.getSize()
      const fontSize = 11
      const margin = 48
      const maxWidth = width - margin * 2
      const lineH = fontSize * 1.5

      // very simple word-wrap
      const words = text.split(/\s+/)
      const lines: string[] = []
      let cur = ''
      for (const w of words) {
        const test = cur ? cur + ' ' + w : w
        if (test.length * (fontSize * 0.5) > maxWidth) {
          lines.push(cur)
          cur = w
        } else {
          cur = test
        }
      }
      if (cur) lines.push(cur)

      let y = height - margin
      for (const line of lines) {
        if (y < margin) break
        page.drawText(line, { x: margin, y, size: fontSize, color: { r: 0.1, g: 0.1, b: 0.1 } as never })
        y -= lineH
      }
    }
  }

  const pdfBytes = await merged.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
