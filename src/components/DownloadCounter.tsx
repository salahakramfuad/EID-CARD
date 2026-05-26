import { useEffect, useState } from 'react'
import { DOWNLOAD_COUNT_BASE, fetchDownloadCount } from '../lib/downloadCounter'

type DownloadCounterProps = {
  /** Bump display when a download completes in this session. */
  refreshKey?: number
  className?: string
}

export default function DownloadCounter({ refreshKey = 0, className = '' }: DownloadCounterProps) {
  const [count, setCount] = useState(DOWNLOAD_COUNT_BASE)

  useEffect(() => {
    let cancelled = false
    void fetchDownloadCount().then((n) => {
      if (!cancelled) setCount(n)
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return (
    <p
      className={[
        'text-xs text-zinc-600 dark:text-zinc-400',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-live="polite"
    >
      <span className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
        {count.toLocaleString()}
      </span>{' '}
      cards downloaded
    </p>
  )
}
