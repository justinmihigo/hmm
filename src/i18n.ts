/**
 * English is the only published language for now. Keep all site-wide labels
 * here so a future locale can be added without changing navigation or number
 * formatting logic throughout the app.
 */
const english = {
  navigation: {
    about: 'About',
    portfolio: 'Portfolio',
    performance: 'Performance',
    teaching: 'Teaching',
    filmScreen: 'Film & Screen',
    classes: 'Classes',
    press: 'Press',
    contact: 'Contact',
    getInTouch: 'Get in touch',
  },
  footer: {
    youtube: 'YouTube',
    instagram: 'Instagram',
    facebook: 'Facebook',
    homeOfDance: 'Home of Dance',
  },
  accessibility: {
    openPortfolioMenu: 'Open portfolio menu',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
    skipToContent: 'Skip to content',
  },
} as const

export const dictionaries = { en: english } as const
export type Locale = keyof typeof dictionaries
export const supportedLocales = Object.keys(dictionaries) as Locale[]
export const defaultLocale: Locale = 'en'

export function getSiteCopy(locale: Locale = defaultLocale) {
  return dictionaries[locale]
}

export function formatNumber(value: number, locale: Locale = defaultLocale) {
  // Map the public site locale to the corresponding Intl locale as languages
  // are introduced (for example, `fr` to `fr-RW`).
  const intlLocale = locale === 'en' ? 'en-US' : locale
  return new Intl.NumberFormat(intlLocale).format(value)
}
