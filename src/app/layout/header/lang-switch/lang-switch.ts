import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Lang, languages } from '../../../core/models/localized.model';
import { I18n } from '../../../i18n/i18n.service';

// Each language is named in its own language, so a reader who doesn't understand
// the current one still recognises theirs.
const nativeNames: Record<Lang, string> = { es: 'Español', en: 'English' };

/** Rendered like an environment variable: LANG= es en, the active one in reverse video. */
@Component({
  selector: 'app-lang-switch',
  template: `
    <div class="switch" role="group" [attr.aria-label]="i18n.t().nav.language">
      <span class="prefix" aria-hidden="true">LANG=</span>
      @for (lang of languages; track lang) {
        <button
          type="button"
          [attr.lang]="lang"
          [attr.aria-label]="names[lang]"
          [attr.aria-pressed]="i18n.lang() === lang"
          (click)="i18n.setLang(lang)"
        >
          {{ lang }}
        </button>
      }
    </div>
  `,
  styleUrl: './lang-switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitch {
  protected readonly i18n = inject(I18n);
  protected readonly languages = languages;
  protected readonly names = nativeNames;
}
