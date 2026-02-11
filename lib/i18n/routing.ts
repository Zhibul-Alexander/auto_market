export const locales = ['ge', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ge';

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}
