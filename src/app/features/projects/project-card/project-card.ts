import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { languageStyle } from '../../../config/languages';
import { pickText } from '../../../core/models/localized.model';
import { Project } from '../../../core/models/project.model';
import { I18n } from '../../../i18n/i18n.service';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-project-card',
  imports: [Icon, SlicePipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listitem',
    '[class.featured]': 'project().featured',
    '[style.--c]': 'color()',
  },
})
export class ProjectCard {
  readonly project = input.required<Project>();

  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;

  private readonly imageFailed = signal(false);

  protected readonly color = computed(() =>
    this.project().featured ? 'var(--accent)' : languageStyle(this.project().language).color,
  );
  protected readonly description = computed(() =>
    pickText(this.project().description, this.i18n.lang()),
  );
  protected readonly extension = computed(() => languageStyle(this.project().language).extension);
  protected readonly showImage = computed(() => !!this.project().imageUrl && !this.imageFailed());

  /** Group members are shown without the shared prefix: complyx-agent -> agent. */
  protected readonly members = computed(() => {
    const { slug, repos } = this.project();
    return repos.map((repo) => ({
      ...repo,
      shortName: repo.name === slug ? repo.name : repo.name.replace(`${slug}-`, ''),
    }));
  });

  /** Lines of the `tree -L 1` output drawn when a group has no image. */
  protected readonly treeLines = computed(() => {
    const members = this.members();
    const width = Math.max(...members.map((member) => member.name.length));
    return members.map((member, index) => ({
      text: `${index === members.length - 1 ? '└──' : '├──'} ${member.name.padEnd(width)}  `,
      language: member.language?.toLowerCase() ?? '-',
    }));
  });

  protected onImageError() {
    this.imageFailed.set(true);
  }
}
