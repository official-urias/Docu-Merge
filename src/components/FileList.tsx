import React, { useCallback } from 'react'
import { GripVertical, X, ChevronUp, ChevronDown } from 'lucide-react'
import type { DocFile } from '../utils/fileTypes'
import { formatSize } from '../utils/fileTypes'
import { FileIcon, typeBadge } from './FileIcon'
import styles from './FileList.module.css'

interface FileListProps {
  files: DocFile[]
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove, onReorder }) => {
  const dragRef = React.useRef<number | null>(null)
  const [dragOver, setDragOver] = React.useState<number | null>(null)

  const handleDragStart = (index: number) => {
    dragRef.current = index
  }

  const handleDrop = useCallback(
    (toIndex: number) => {
      if (dragRef.current === null || dragRef.current === toIndex) return
      onReorder(dragRef.current, toIndex)
      dragRef.current = null
      setDragOver(null)
    },
    [onReorder],
  )

  if (files.length === 0) return null

  return (
    <div className={styles.list} role="list" aria-label="Uploaded documents">
      <div className={styles.header}>
        <span className={styles.headerText}>{files.length} file{files.length !== 1 ? 's' : ''} queued</span>
        <span className={styles.headerHint}>Drag rows to reorder · Merge order is top→bottom</span>
      </div>

      {files.map((doc, index) => (
        <div
          key={doc.id}
          role="listitem"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={e => { e.preventDefault(); setDragOver(index) }}
          onDragLeave={() => setDragOver(null)}
          onDrop={() => handleDrop(index)}
          className={`${styles.item} ${dragOver === index ? styles.dragOver : ''}`}
        >
          {/* Drag handle */}
          <span className={styles.handle} aria-hidden>
            <GripVertical size={16} color="var(--gray-400)" />
          </span>

          {/* Order badge */}
          <span className={styles.order}>{index + 1}</span>

          {/* File icon */}
          <FileIcon type={doc.type} size={18} />

          {/* Name & meta */}
          <div className={styles.meta}>
            <span className={styles.name} title={doc.name}>{doc.name}</span>
            <span className={styles.info}>
              {typeBadge(doc.type)}
              <span className={styles.size}>{formatSize(doc.size)}</span>
            </span>
          </div>

          {/* Up / Down */}
          <div className={styles.arrows}>
            <button
              className={styles.arrowBtn}
              onClick={() => index > 0 && onReorder(index, index - 1)}
              disabled={index === 0}
              aria-label="Move up"
              title="Move up"
            >
              <ChevronUp size={14} />
            </button>
            <button
              className={styles.arrowBtn}
              onClick={() => index < files.length - 1 && onReorder(index, index + 1)}
              disabled={index === files.length - 1}
              aria-label="Move down"
              title="Move down"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Remove */}
          <button
            className={styles.remove}
            onClick={() => onRemove(doc.id)}
            aria-label={`Remove ${doc.name}`}
            title="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
