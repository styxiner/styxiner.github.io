import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { I18n } from '../../i18n/i18n.service';
import { Icon } from '../../shared/icon/icon';
import { StatusTag } from '../../shared/status-tag/status-tag';
import { LangSwitch } from './lang-switch/lang-switch';

@Component({
  selector: 'app-header',
  imports: [Icon, StatusTag, LangSwitch],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeMenu()' },
})
export class Header {
  protected readonly t = inject(I18n).t;

  /** Section ids, in page order. Labels come from nav.items in the dictionaries. */
  protected readonly sectionIds = ['about', 'stack', 'projects', 'certs', 'contact'] as const;

  protected readonly activeId = signal<string | null>(null);
  protected readonly menuOpen = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Highlight the section that crosses the middle of the viewport.
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.activeId.set(entry.target.id);
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      for (const id of this.sectionIds) {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      }
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu() {
    this.menuOpen.set(false);
  }
}
