import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { languageStyle } from '../../config/languages';
import { siteConfig } from '../../config/site.config';
import { ProjectsService } from '../../core/services/projects.service';
import { I18n } from '../../i18n/i18n.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-hero',
  imports: [Icon, SlicePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly site = siteConfig;
  protected readonly t = inject(I18n).t;
  protected readonly activity = inject(ProjectsService).activity;

  protected readonly languages = computed(() =>
    (this.activity()?.languages ?? []).slice(0, 4).map((language) => ({
      ...language,
      color: languageStyle(language.name).color,
    })),
  );
}
