import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n.service';
import { ManSection } from '../../shared/man-section/man-section';

@Component({
  selector: 'app-about',
  imports: [ManSection],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly t = inject(I18n).t;
}
