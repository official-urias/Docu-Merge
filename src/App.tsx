import React, { useCallback, useState } from 'react'
import { Layers, Shield, Cpu, Trash2 } from 'lucide-react'
import type { DocFile } from './utils/fileTypes'
import { detectType, uid } from './utils/fileTypes'
import {
  mergePDFs,
  imagesPDF,
  mergeText,
  mergeExcel,
  mergeMixed,
  downloadBlob,
} from './utils/mergeEngines'
import { DropZone } from './components/DropZone'
import { FileList } from './components/FileList'
import { MergeOptions } from './components/MergeOptions'
import type { MergeMode } from './components/MergeOptions'
import { MergeButton } from './components/MergeButton'
import type { MergeStatus } from './components/MergeButton'
import styles from './App.module.css'

function getExtension(mode: MergeMode, files: DocFile[]): string {
  if (mode === 'excel') return '.xlsx'
  if (mode === 'text') return '.txt'
  if (mode === 'pdf' || mode === 'images-pdf' || mode === 'mixed-pdf') return '.pdf'
  // auto
  const types = new Set(files.map(f => f.type))
  if (types.size === 1) {
    const t = [...types][0]
    if (t === 'excel') return '.xlsx'
    if (t === 'text') return '.txt'
    if (t === 'pdf') return '.pdf'
    if (t === 'image') return '.pdf'
  }
  return '.pdf'
}

export default function App() {
  const [files, setFiles] = useState<DocFile[]>([])
  const [mode, setMode] = useState<MergeMode>('auto')
  const [outputName, setOutputName] = useState('merged-document')
  const [status, setStatus] = useState<MergeStatus>('idle')
  const [errorMsg, setErrorMsg] = useState<string>()

  const addFiles = useCallback((incoming: File[]) => {
    const next: DocFile[] = incoming.map(file => ({
      id: uid(),
      file,
      name: file.name,
      size: file.size,
      type: detectType(file),
    }))
    setFiles(prev => [...prev, ...next])
    setStatus('idle')
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setStatus('idle')
  }, [])

  const reorder = useCallback((from: number, to: number) => {
    setFiles(prev => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }, [])

  const clearAll = () => {
    setFiles([])
    setStatus('idle')
    setErrorMsg(undefined)
  }

  const handleMerge = async () => {
    if (files.length < 2) return
    setStatus('processing')
    setErrorMsg(undefined)

    try {
      let blob: Blob
      const ext = getExtension(mode, files)
      const filename = outputName.replace(/\.[^.]+$/, '') + ext

      // Resolve effective mode for 'auto'
      const effectiveMode = resolveAuto(mode, files)

      if (effectiveMode === 'pdf') {
        blob = await mergePDFs(files)
      } else if (effectiveMode === 'images-pdf') {
        blob = await imagesPDF(files)
      } else if (effectiveMode === 'text') {
        blob = await mergeText(files)
      } else if (effectiveMode === 'excel') {
        blob = await mergeExcel(files)
      } else {
        blob = await mergeMixed(files)
      }

      downloadBlob(blob, filename)
      setStatus('done')
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Merge failed. Please try again.')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setErrorMsg(undefined)
  }

  return (
    <div className={styles.page}>
      {/* ── Header ───────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <Layers size={22} strokeWidth={2} />
            </span>
            <span className={styles.logoText}>DocuMerge</span>
          </div>
          <nav className={styles.pills}>
            <span className={styles.pill}><Shield size={13} /> 100% Private</span>
            <span className={styles.pill}><Cpu size={13} /> In-browser</span>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Merge any documents<br />in seconds</h1>
        <p className={styles.heroSub}>
          PDF · Word · Excel · Images · Text — all merged locally.<br />
          Nothing is ever uploaded to a server.
        </p>
      </section>

      {/* ── Main card ────────────────────────────────── */}
      <main className={styles.main}>
        <div className={styles.card}>

          {/* Drop zone */}
          <section aria-label="Upload files">
            <DropZone onFiles={addFiles} />
          </section>

          {/* File list */}
          {files.length > 0 && (
            <section aria-label="File queue" className={styles.section}>
              <FileList files={files} onRemove={removeFile} onReorder={reorder} />
              <button className={styles.clearBtn} onClick={clearAll}>
                <Trash2 size={13} />
                Clear all
              </button>
            </section>
          )}

          {/* Divider */}
          {files.length > 0 && <div className={styles.divider} />}

          {/* Options */}
          {files.length > 0 && (
            <section aria-label="Merge options" className={styles.section}>
              <MergeOptions
                selected={mode}
                onChange={setMode}
                outputName={outputName}
                onOutputNameChange={setOutputName}
              />
            </section>
          )}

          {/* Merge button */}
          {files.length > 0 && (
            <section aria-label="Merge action" className={styles.section}>
              <MergeButton
                status={status}
                errorMsg={errorMsg}
                disabled={files.length < 2}
                onMerge={handleMerge}
                onReset={handleReset}
              />
            </section>
          )}
        </div>
      </main>

      {/* ── Feature highlights ───────────────────────── */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.feature}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div>
                <p className={styles.featureTitle}>{f.title}</p>
                <p className={styles.featureSub}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} DocuMerge · All processing happens in your browser</p>
      </footer>
    </div>
  )
}

// ── helpers ──────────────────────────────────────────────────
function resolveAuto(mode: MergeMode, files: DocFile[]): MergeMode {
  if (mode !== 'auto') return mode
  const types = new Set(files.map(f => f.type))
  if ([...types].every(t => t === 'pdf')) return 'pdf'
  if ([...types].every(t => t === 'excel')) return 'excel'
  if ([...types].every(t => t === 'image')) return 'images-pdf'
  if ([...types].every(t => t === 'text')) return 'text'
  return 'mixed-pdf'
}

const FEATURES = [
  {
    icon: '🔒',
    title: 'Fully Private',
    desc: 'Your files never leave your device. All merging runs in the browser.',
  },
  {
    icon: '📄',
    title: 'All Formats',
    desc: 'PDF, Word, Excel, CSV, plain text, PNG, JPEG and more.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'No upload wait times. Merge happens instantly, locally.',
  },
  {
    icon: '↕️',
    title: 'Custom Order',
    desc: 'Drag and drop to reorder pages before merging.',
  },
]
