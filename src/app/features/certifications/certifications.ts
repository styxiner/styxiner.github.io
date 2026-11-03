import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { certifications } from '../../config/certifications.config';
import { I18n } from '../../i18n/i18n.service';
import { ManSection } from '../../shared/man-section/man-section';
import { StatusTag } from '../../shared/status-tag/status-tag';

@Component({
  selector: 'app-certifications',
  imports: [ManSection, StatusTag],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Certifications {
  protected readonly t = inject(I18n).t;
  protected readonly certifications = certifications;
}
