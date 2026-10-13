import React from 'react'
import { CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react'
import styles from './MergeButton.module.css'

export type MergeStatus = 'idle' | 'processing' | 'done' | 'error'

interface MergeButtonProps {
  status: MergeStatus
  errorMsg?: string
  disabled?: boolean
  onMerge: () => void
  onReset: () => void
}

export const MergeButton: React.FC<MergeButtonProps> = ({
  status,
  errorMsg,
  disabled,
  onMerge,
  onReset,
}) => {
  return (
    <div className={styles.wrap}>
      {status === 'idle' && (
        <button
          className={styles.btn}
          onClick={onMerge}
          disabled={disabled}
          id="merge-btn"
        >
          <Download size={18} strokeWidth={2} />
          Merge & Download
        </button>
      )}

      {status === 'processing' && (
        <button className={`${styles.btn} ${styles.processing}`} disabled>
          <Loader2 size={18} className={styles.spin} />
          Merging…
        </button>
      )}

      {status === 'done' && (
        <div className={styles.resultRow}>
          <div className={styles.successBadge}>
            <CheckCircle2 size={18} />
            Done! File downloaded.
          </div>
          <button className={styles.resetBtn} onClick={onReset}>
            Merge another batch
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.resultRow}>
          <div className={styles.errorBadge}>
            <AlertCircle size={18} />
            {errorMsg ?? 'Something went wrong.'}
          </div>
          <button className={styles.resetBtn} onClick={onReset}>
            Try again
          </button>
        </div>
      )}

      {status === 'idle' && disabled && (
        <p className={styles.hint}>Add at least 2 files to merge</p>
      )}
    </div>
  )
}
