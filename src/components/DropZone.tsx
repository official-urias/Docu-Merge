import React, { useCallback, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { ACCEPTED } from '../utils/fileTypes'
import styles from './DropZone.module.css'

interface DropZoneProps {
  onFiles: (files: File[]) => void
}

export const DropZone: React.FC<DropZoneProps> = ({ onFiles }) => {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length) onFiles(files)
    },
    [onFiles],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) onFiles(files)
    e.target.value = ''
  }

  return (
    <label
      className={`${styles.zone} ${dragging ? styles.active : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      htmlFor="file-input"
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept={ACCEPTED}
        onChange={handleChange}
        className={styles.input}
        aria-label="Upload documents"
      />

      <div className={styles.icon}>
        <UploadCloud size={36} strokeWidth={1.5} color={dragging ? '#2563eb' : '#94a3b8'} />
      </div>

      <p className={styles.title}>
        {dragging ? 'Drop your files here' : 'Drag & drop files here'}
      </p>
      <p className={styles.sub}>
        or <span className={styles.link}>browse your computer</span>
      </p>
      <p className={styles.hint}>
        PDF · Word · Excel · Images · Text — any combination
      </p>
    </label>
  )
}
