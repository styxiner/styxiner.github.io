import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Page section laid out like a man page: the section name (DESCRIPCIÓN, VÉASE TAMBIÉN...)
 * sits in a left margin column on desktop and above the content on smaller screens.
 */
@Component({
  selector: 'app-man-section',
  templateUrl: './man-section.html',
  styleUrl: './man-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'sectionId()',
    '[attr.aria-labelledby]': 'sectionId() + "-title"',
    role: 'region',
  },
})
export class ManSection {
  readonly sectionId = input.required<string>();
  readonly label = input.required<string>();
  /** Shell command shown under the label, e.g. 'whoami'. */
  readonly command = input.required<string>();
}
