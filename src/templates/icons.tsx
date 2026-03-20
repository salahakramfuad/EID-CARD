export function StarIcon({
  className,
  title,
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M12 2.5l2.6 6.7 7.2.4-5.6 4.5 1.8 6.9-6-3.9-6 3.9 1.8-6.9-5.6-4.5 7.2-.4L12 2.5z"
      />
    </svg>
  )
}

export function CrescentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M21 14.3c-1.4.8-3.1 1.2-4.9 1.2-5.6 0-10.1-4.5-10.1-10.1 0-1.1.2-2.2.6-3.1C4.1 3.1 2.5 5.8 2.5 9c0 6.1 5 11.1 11.1 11.1 3.2 0 6-1.7 7.4-4.2z"
      />
    </svg>
  )
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2zm8.2 11.5l.8 3.1 3.1.8-3.1.8-.8 3.1-.8-3.1-3.1-.8 3.1-.8.8-3.1z"
      />
    </svg>
  )
}

