import { pickText } from './localized.model';

describe('pickText', () => {
  it('returns plain strings unchanged in every language', () => {
    expect(pickText('Web eskufest', 'en')).toBe('Web eskufest');
  });

  it('picks the requested language', () => {
    expect(pickText({ es: 'hola', en: 'hello' }, 'en')).toBe('hello');
  });

  it('falls back to another language when a translation is missing', () => {
    expect(pickText({ es: 'solo en español' }, 'en')).toBe('solo en español');
  });

  it('keeps null as null', () => {
    expect(pickText(null, 'es')).toBeNull();
  });
});
