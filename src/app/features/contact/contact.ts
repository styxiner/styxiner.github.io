import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { siteConfig } from '../../config/site.config';
import { I18n } from '../../i18n/i18n.service';
import { Icon } from '../../shared/icon/icon';
import { ManSection } from '../../shared/man-section/man-section';

@Component({
  selector: 'app-contact',
  imports: [Icon, ManSection],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly t = inject(I18n).t;
  protected readonly social = siteConfig.social;
  protected readonly email = siteConfig.email;
}
