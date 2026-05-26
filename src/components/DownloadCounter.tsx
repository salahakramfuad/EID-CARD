import { DOWNLOAD_COUNT_BASE } from '../lib/downloadCounter'

type DownloadCounterProps = {
  count?: number
  className?: string
}

export default function DownloadCounter({ count = DOWNLOAD_COUNT_BASE, className = '' }: DownloadCounterProps) {
  return (
    <p
      className={['text-xs text-zinc-600 dark:text-zinc-400', className].filter(Boolean).join(' ')}
      aria-live="polite"
    >
      <span className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
        {count.toLocaleString()}
      </span>{' '}
      cards downloaded
    </p>
  )
}
