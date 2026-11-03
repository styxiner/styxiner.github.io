import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { skillGroups } from '../../config/skills.config';
import { I18n } from '../../i18n/i18n.service';
import { ManSection } from '../../shared/man-section/man-section';

@Component({
  selector: 'app-skills',
  imports: [ManSection],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  protected readonly t = inject(I18n).t;
  protected readonly groups = skillGroups;
}
