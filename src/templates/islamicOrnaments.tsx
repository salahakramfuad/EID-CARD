/**
 * Large SVG ornament layers for Islamic / elegant card richness.
 * Gradient ids are prefixed to avoid clashes when multiple layers mount.
 */

type AccentProps = {
  accentColor: string
  opacity?: number
  className?: string
}

/** Four corner brackets + mid-edge khatam dots — sits inside card rounded rect. */
export function IslamicCornerFrame({ accentColor, opacity = 0.22, className }: AccentProps) {
  const c = accentColor
  return (
    <svg
      viewBox="0 0 720 1080"
      aria-hidden="true"
      className={className}
      style={{ color: c, opacity }}
    >
      <defs>
        <linearGradient id="islCornerGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.15" />
          <stop offset="45%" stopColor={c} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Top-left */}
      <path
        fill="none"
        stroke="url(#islCornerGlow)"
        strokeWidth="1.8"
        d="M 52 118 Q 52 56 118 56 M 56 118 Q 56 60 112 60"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.65"
        d="M 76 92 L 92 76 M 82 100 L 100 82"
      />
      {/* Top-right */}
      <path
        fill="none"
        stroke="url(#islCornerGlow)"
        strokeWidth="1.8"
        d="M 668 118 Q 668 56 602 56 M 664 118 Q 664 60 608 60"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.65"
        d="M 644 92 L 628 76 M 638 100 L 620 82"
      />
      {/* Bottom-left */}
      <path
        fill="none"
        stroke="url(#islCornerGlow)"
        strokeWidth="1.8"
        d="M 52 962 Q 52 1024 118 1024 M 56 962 Q 56 1020 112 1020"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.65"
        d="M 76 988 L 92 1004 M 82 980 L 100 998"
      />
      {/* Bottom-right */}
      <path
        fill="none"
        stroke="url(#islCornerGlow)"
        strokeWidth="1.8"
        d="M 668 962 Q 668 1024 602 1024 M 664 962 Q 664 1020 608 1020"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.65"
        d="M 644 988 L 628 1004 M 638 980 L 620 998"
      />
      {/* Small khatam diamonds at cardinal mid-frame */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        opacity="0.35"
        d="M360 42 L372 54 360 66 348 54ZM360 48 L366 54 360 60 354 54Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        opacity="0.28"
        d="M42 540 L54 552 42 564 30 552ZM42 546 L48 552 42 558 36 552Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        opacity="0.28"
        d="M678 540 L690 552 678 564 666 552ZM678 546 L684 552 678 558 672 552Z"
      />
    </svg>
  )
}

/** Horizontal arabesque band — place above footer / signature. */
export function IslamicArabesqueBand({ accentColor, opacity = 0.24, className }: AccentProps) {
  const c = accentColor
  return (
    <svg
      viewBox="0 0 720 48"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ color: c, opacity }}
    >
      <defs>
        <linearGradient id="islBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c} stopOpacity="0" />
          <stop offset="18%" stopColor={c} stopOpacity="0.55" />
          <stop offset="50%" stopColor={c} stopOpacity="0.8" />
          <stop offset="82%" stopColor={c} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        fill="none"
        stroke="url(#islBandGrad)"
        strokeWidth="1.4"
        d="M 0 24 Q 90 6 180 24 T 360 24 T 540 24 T 720 24"
      />
      <path fill="currentColor" fillRule="evenodd" opacity="0.45" d="M352 14h16v4h-4v8h-8v-8h-4Z" />
      <path fill="currentColor" fillRule="evenodd" opacity="0.35" d="M356 18h8v8h-8zM358 20h4v4h-4z" />
    </svg>
  )
}

/** Elegant filigree corners (euro-Islamic blend). */
export function ElegantFiligreeCorners({ accentColor, opacity = 0.2, className }: AccentProps) {
  const c = accentColor
  return (
    <svg viewBox="0 0 720 1080" aria-hidden="true" className={className} style={{ color: c, opacity }}>
      <defs>
        <linearGradient id="elgFiligree" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c} stopOpacity="0.65" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#elgFiligree)" strokeWidth="1.35">
        <path d="M 48 128 C 48 70 70 48 128 48 M 48 112 C 56 64 64 56 112 48" />
        <path d="M 672 128 C 672 70 650 48 592 48 M 672 112 C 664 64 656 56 608 48" />
        <path d="M 48 952 C 48 1010 70 1032 128 1032 M 48 968 C 56 1016 64 1024 112 1032" />
        <path d="M 672 952 C 672 1010 650 1032 592 1032 M 672 968 C 664 1016 656 1024 608 1032" />
      </g>
      <g fill="currentColor" opacity="0.4">
        <path fillRule="evenodd" d="M 118 72 L 128 82 118 92 108 82 Z M 118 78 L 122 82 118 86 114 82 Z" />
        <path fillRule="evenodd" d="M 602 72 L 612 82 602 92 592 82 Z M 602 78 L 606 82 602 86 598 82 Z" />
        <path fillRule="evenodd" d="M 118 1008 L 128 998 118 988 108 998 Z M 118 1002 L 122 998 118 994 114 998 Z" />
        <path fillRule="evenodd" d="M 602 1008 L 612 998 602 988 592 998 Z M 602 1002 L 606 998 602 994 598 998 Z" />
      </g>
    </svg>
  )
}
