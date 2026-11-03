import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Lang, languages } from '../core/models/localized.model';
import { en } from './en';
import { es, Translations } from './es';

const dictionaries: Record<Lang, Translations> = { es, en };
const storageKey = 'lang';
const defaultLang: Lang = 'es';

/**
 * Current language and its texts. Components read `t()` in their templates, so switching
 * language re-renders every text at once without reloading the page.
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly lang = signal<Lang>(this.initialLang());
  readonly t = computed(() => dictionaries[this.lang()]);

  constructor() {
    effect(() => {
      const t = this.t();
      this.document.documentElement.lang = this.lang();
      this.title.setTitle(t.meta.title);
      this.meta.updateTag({ name: 'description', content: t.meta.description });
    });
  }

  setLang(lang: Lang) {
    this.lang.set(lang);
    try {
      localStorage.setItem(storageKey, lang);
    } catch {
      // Storage can be blocked (private mode); the choice just won't be remembered.
    }
  }

  /** Saved choice first, then the browser's preferred languages, then Spanish. */
  private initialLang(): Lang {
    try {
      const saved = localStorage.getItem(storageKey);
      if (isLang(saved)) return saved;
    } catch {
      // ignore, fall through to the browser preference
    }
    const preferred = this.document.defaultView?.navigator.languages ?? [];
    for (const tag of preferred) {
      const base = tag.slice(0, 2).toLowerCase();
      if (isLang(base)) return base;
    }
    return defaultLang;
  }
}

function isLang(value: string | null): value is Lang {
  return languages.includes(value as Lang);
}
