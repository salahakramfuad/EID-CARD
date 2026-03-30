export type FontOption = {
  id: string
  label: string
  /**
   * CSS font-family value.
   * Keep it as a plain string so we can apply it directly to the card.
   */
  familyCss: string
  href: string
}

export const fontOptions: FontOption[] = [
  {
    id: 'cairo',
    label: 'Cairo (Arabic-friendly)',
    familyCss: "'Cairo', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap',
  },
  {
    id: 'amiri',
    label: 'Amiri (elegant Arabic)',
    familyCss: "'Amiri', ui-serif, Georgia, Cambria, Times New Roman",
    href: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
  },
  {
    id: 'el-messiri',
    label: 'El Messiri',
    familyCss: "'El Messiri', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&display=swap',
  },
  {
    id: 'tajawal',
    label: 'Tajawal',
    familyCss: "'Tajawal', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
  },
  {
    id: 'reem-kufi',
    label: 'Reem Kufi',
    familyCss: "'Reem Kufi', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&display=swap',
  },
  {
    id: 'noto-naskh',
    label: 'Noto Naskh Arabic',
    familyCss: "'Noto Naskh Arabic', ui-serif, Georgia, Cambria",
    href: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap',
  },
  {
    id: 'playfair',
    label: 'Playfair Display',
    familyCss: "'Playfair Display', ui-serif, Georgia, Cambria, Times New Roman",
    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap',
  },
  {
    id: 'cormorant',
    label: 'Cormorant Garamond',
    familyCss: "'Cormorant Garamond', ui-serif, Georgia, Cambria",
    href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap',
  },
  {
    id: 'cinzel',
    label: 'Cinzel (classical)',
    familyCss: "'Cinzel', ui-serif, Georgia, Cambria",
    href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap',
  },
  {
    id: 'great-vibes',
    label: 'Great Vibes (script)',
    familyCss: "'Great Vibes', cursive, ui-serif",
    href: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
  },
  {
    id: 'poppins',
    label: 'Poppins',
    familyCss: "'Poppins', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap',
  },
  {
    id: 'dm-sans',
    label: 'DM Sans',
    familyCss: "'DM Sans', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
  },
  {
    id: 'lexend',
    label: 'Lexend',
    familyCss: "'Lexend', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap',
  },
  {
    id: 'lora',
    label: 'Lora',
    familyCss: "'Lora', ui-serif, Georgia, Cambria",
    href: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap',
  },
  {
    id: 'raleway',
    label: 'Raleway',
    familyCss: "'Raleway', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap',
  },
]
