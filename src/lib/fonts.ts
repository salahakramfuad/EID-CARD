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
    href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
  },
  {
    id: 'playfair',
    label: 'Playfair Display',
    familyCss: "'Playfair Display', ui-serif, Georgia, Cambria, Times New Roman",
    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;800&display=swap',
  },
  {
    id: 'poppins',
    label: 'Poppins',
    familyCss: "'Poppins', ui-sans-serif, system-ui, -apple-system",
    href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap',
  },
  {
    id: 'amiri',
    label: 'Amiri (Elegant Arabic)',
    familyCss: "'Amiri', ui-serif, Georgia, Cambria, Times New Roman",
    href: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
  },
]

