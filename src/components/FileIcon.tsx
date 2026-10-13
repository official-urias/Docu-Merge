import React from 'react'
import type { DocType } from '../utils/fileTypes'
import {
  FileText, FileSpreadsheet, Image, File, AlignLeft,
} from 'lucide-react'

interface FileIconProps {
  type: DocType
  size?: number
}

const CONFIG: Record<DocType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  pdf: { icon: FileText, color: '#dc2626', bg: '#fef2f2', label: 'PDF' },
  word: { icon: FileText, color: '#2563eb', bg: '#eff6ff', label: 'Word' },
  excel: { icon: FileSpreadsheet, color: '#16a34a', bg: '#f0fdf4', label: 'Excel' },
  image: { icon: Image, color: '#9333ea', bg: '#faf5ff', label: 'Image' },
  text: { icon: AlignLeft, color: '#d97706', bg: '#fffbeb', label: 'Text' },
  unknown: { icon: File, color: '#6b7280', bg: '#f9fafb', label: 'File' },
}

export const FileIcon: React.FC<FileIconProps> = ({ type, size = 20 }) => {
  const { icon: Icon, color, bg } = CONFIG[type]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 16,
        height: size + 16,
        borderRadius: 8,
        background: bg,
        flexShrink: 0,
      }}
    >
      <Icon size={size} color={color} strokeWidth={1.8} />
    </span>
  )
}

export const typeBadge = (type: DocType) => {
  const { color, bg, label } = CONFIG[type]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        color,
        background: bg,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  )
}
