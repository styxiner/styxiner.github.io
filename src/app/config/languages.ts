// Colours and short extensions for the languages GitHub reports on your repositories.
// Unknown languages fall back to a neutral grey and the first three letters.

interface LanguageStyle {
  color: string;
  extension: string;
}

const languages: Record<string, LanguageStyle> = {
  Rust: { color: '#dea584', extension: '.rs' },
  TypeScript: { color: '#5b9be0', extension: '.ts' },
  JavaScript: { color: '#e8d44d', extension: '.js' },
  Python: { color: '#6d9fd6', extension: '.py' },
  Java: { color: '#d08b3c', extension: '.java' },
  HTML: { color: '#e3734f', extension: '.html' },
  Shell: { color: '#89e051', extension: '.sh' },
  Go: { color: '#4fc3d9', extension: '.go' },
  C: { color: '#a8b9cc', extension: '.c' },
};

const fallback: LanguageStyle = { color: '#8e97a3', extension: '' };

export function languageStyle(language: string | null): LanguageStyle {
  if (!language) return fallback;
  return (
    languages[language] ?? { ...fallback, extension: '.' + language.slice(0, 3).toLowerCase() }
  );
}
