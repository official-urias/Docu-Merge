import React from 'react'
import { Layers, FileText, FileSpreadsheet, Image, AlignLeft, GitMerge } from 'lucide-react'
import type { DocType } from '../utils/fileTypes'
import styles from './MergeOptions.module.css'

export type MergeMode =
  | 'auto'
  | 'pdf'
  | 'excel'
  | 'images-pdf'
  | 'text'
  | 'mixed-pdf'

interface MergeModeOption {
  id: MergeMode
  label: string
  description: string
  icon: React.ElementType
  accepts: DocType[]
}

export const MODES: MergeModeOption[] = [
  {
    id: 'auto',
    label: 'Auto-detect',
    description: 'Automatically choose the best merge strategy',
    icon: Layers,
    accepts: ['pdf', 'word', 'excel', 'image', 'text', 'unknown'],
  },
  {
    id: 'pdf',
    label: 'Merge PDFs',
    description: 'Combine multiple PDFs into one document',
    icon: FileText,
    accepts: ['pdf'],
  },
  {
    id: 'excel',
    label: 'Merge Spreadsheets',
    description: 'Combine Excel/CSV sheets into one workbook',
    icon: FileSpreadsheet,
    accepts: ['excel'],
  },
  {
    id: 'images-pdf',
    label: 'Images → PDF',
    description: 'Pack images into a single PDF file',
    icon: Image,
    accepts: ['image'],
  },
  {
    id: 'text',
    label: 'Merge Text',
    description: 'Concatenate plain text / Markdown files',
    icon: AlignLeft,
    accepts: ['text'],
  },
  {
    id: 'mixed-pdf',
    label: 'Mixed → PDF',
    description: 'Combine PDFs, images & text into one PDF',
    icon: GitMerge,
    accepts: ['pdf', 'image', 'text'],
  },
]

interface MergeOptionsProps {
  selected: MergeMode
  onChange: (mode: MergeMode) => void
  outputName: string
  onOutputNameChange: (v: string) => void
}

export const MergeOptions: React.FC<MergeOptionsProps> = ({
  selected,
  onChange,
  outputName,
  onOutputNameChange,
}) => {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.sectionTitle}>Merge Strategy</h2>

      <div className={styles.grid}>
        {MODES.map(mode => {
          const Icon = mode.icon
          const active = selected === mode.id
          return (
            <button
              key={mode.id}
              className={`${styles.card} ${active ? styles.active : ''}`}
              onClick={() => onChange(mode.id)}
              aria-pressed={active}
            >
              <span className={`${styles.cardIcon} ${active ? styles.cardIconActive : ''}`}>
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <span className={styles.cardLabel}>{mode.label}</span>
              <span className={styles.cardDesc}>{mode.description}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.row}>
        <label className={styles.label} htmlFor="output-name">
          Output filename
        </label>
        <input
          id="output-name"
          className={styles.input}
          type="text"
          value={outputName}
          onChange={e => onOutputNameChange(e.target.value)}
          placeholder="merged-document"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
