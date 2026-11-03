import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { siteConfig } from '../../config/site.config';
import { I18n } from '../../i18n/i18n.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly t = inject(I18n).t;
  protected readonly year = new Date().getFullYear();
  protected readonly social = siteConfig.social;
}
