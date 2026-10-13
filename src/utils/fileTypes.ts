/**
 * Document type detection helpers
 */
export type DocType = 'pdf' | 'word' | 'excel' | 'image' | 'text' | 'unknown'

export interface DocFile {
  id: string
  file: File
  name: string
  size: number
  type: DocType
  preview?: string   // data URL for images / PDF first page placeholder
}

export function detectType(file: File): DocType {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const mime = file.type.toLowerCase()

  if (mime === 'application/pdf' || ext === 'pdf') return 'pdf'
  if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mime === 'application/msword' ||
    ext === 'docx' || ext === 'doc'
  ) return 'word'
  if (
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mime === 'application/vnd.ms-excel' ||
    ext === 'xlsx' || ext === 'xls' || ext === 'csv'
  ) return 'excel'
  if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image'
  if (mime === 'text/plain' || ext === 'txt' || ext === 'md') return 'text'
  return 'unknown'
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** Accepted MIME types & extensions for the file input */
export const ACCEPTED = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  '.pdf','.docx','.doc','.xlsx','.xls','.csv','.txt','.md',
  '.png','.jpg','.jpeg','.webp','.gif',
].join(',')
