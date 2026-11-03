export const languages = ['es', 'en'] as const;

export type Lang = (typeof languages)[number];

/**
 * Text that may come in several languages. A plain string is used as-is in every language
 * (handy for names or for descriptions you have not translated yet).
 */
export type LocalizedText = string | Partial<Record<Lang, string>>;

/** Returns the text for `lang`, falling back to any other language that exists. */
export function pickText(text: LocalizedText | null, lang: Lang): string | null {
  if (text === null || typeof text === 'string') return text;
  return text[lang] ?? Object.values(text).find(Boolean) ?? null;
}
