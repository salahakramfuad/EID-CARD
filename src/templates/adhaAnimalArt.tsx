import type { ReactNode } from 'react'
import type { AdhaAnimalKind } from './types'

type AnimalArtProps = {
  /** Primary stroke — usually matches card text for contrast on photos */
  strokeColor: string
  className?: string
}

/** Soft halo so lines stay readable on busy backgrounds */
function LineArtGroup({
  strokeColor,
  className,
  children,
}: {
  strokeColor: string
  className?: string
  children: ReactNode
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={strokeColor} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="rgba(0,0,0,0.45)" strokeWidth={4.2} opacity={0.55}>
          {children}
        </g>
        <g stroke={strokeColor} strokeWidth={2.35}>
          {children}
        </g>
      </g>
    </svg>
  )
}

/** Goat — one-line portrait with curved horns & beard hint */
export function GoatArt({ strokeColor, className = '' }: AnimalArtProps) {
  const paths = (
    <>
      <path d="M 112 226 C 68 214 50 164 62 120 C 72 88 98 68 118 64 C 104 36 128 18 150 30 C 168 38 178 58 172 82 C 166 106 146 124 128 128 C 136 150 158 158 166 138 C 160 120 138 114 120 122 C 102 130 90 154 92 180 C 94 206 104 220 112 226" />
      <path d="M 118 64 C 128 82 130 102 120 118 C 110 112 106 100 108 88 C 110 76 114 68 118 64" />
      <path d="M 98 66 C 88 48 90 28 104 24 C 114 28 116 44 110 56" />
      <path d="M 150 30 C 162 14 178 18 176 36 C 172 50 160 54 152 44" />
      <path d="M 82 104 C 58 96 50 114 58 130 C 66 138 78 128 82 116" />
      <path d="M 108 152 C 98 168 88 174 82 164" opacity={0.85} />
      <path d="M 152 130 C 164 126 172 136 168 148 C 164 156 154 154 152 144" />
    </>
  )

  return (
    <LineArtGroup strokeColor={strokeColor} className={className}>
      {paths}
    </LineArtGroup>
  )
}

/** Camel — one-line portrait with neck arch & single hump curve */
export function CamelArt({ strokeColor, className = '' }: AnimalArtProps) {
  const paths = (
    <>
      <path d="M 116 232 C 70 220 48 168 60 122 C 70 88 98 66 122 62 C 108 32 140 22 162 40 C 182 48 192 72 186 98 C 180 124 158 142 136 146 C 144 168 168 176 176 156 C 170 136 148 130 128 138 C 108 146 96 170 98 196 C 100 218 108 228 116 232" />
      {/* Hump & neck sweep */}
      <path d="M 122 62 C 138 48 158 44 170 58 C 180 72 174 92 160 100 C 148 88 134 78 122 62" />
      <path d="M 162 40 C 178 28 198 34 202 54 C 204 72 190 84 176 78 C 172 62 168 48 162 40" />
      <path d="M 86 106 C 60 98 52 116 62 132 C 72 140 84 128 86 114" />
      <path d="M 128 124 C 138 140 136 108 128 124" />
      <path d="M 158 138 C 170 134 178 144 174 156 C 170 164 160 162 158 152" />
    </>
  )

  return (
    <LineArtGroup strokeColor={strokeColor} className={className}>
      {paths}
    </LineArtGroup>
  )
}

export function AdhaAnimalArt({
  kind,
  strokeColor,
  className,
}: {
  kind: AdhaAnimalKind
  strokeColor: string
  className?: string
}) {
  switch (kind) {
    case 'goat':
      return <GoatArt strokeColor={strokeColor} className={className} />
    case 'camel':
      return <CamelArt strokeColor={strokeColor} className={className} />
    case 'cow':
      return null
  }
}

/** Mini animal icon for template picker thumbnails */
export function AnimalThumbnailIcon({ kind, className = '' }: { kind: AdhaAnimalKind; className?: string }) {
  return (
    <AdhaAnimalArt
      kind={kind}
      strokeColor="currentColor"
      className={['h-12 w-full text-zinc-900 dark:text-zinc-100', className].join(' ')}
    />
  )
}
