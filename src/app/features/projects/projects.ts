import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { siteConfig } from '../../config/site.config';
import { ProjectsService } from '../../core/services/projects.service';
import { I18n } from '../../i18n/i18n.service';
import { ManSection } from '../../shared/man-section/man-section';
import { StatusTag } from '../../shared/status-tag/status-tag';
import { ProjectCard } from './project-card/project-card';

@Component({
  selector: 'app-projects',
  imports: [ManSection, ProjectCard, StatusTag, SlicePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly service = inject(ProjectsService);
  protected readonly t = inject(I18n).t;
  protected readonly githubReposUrl = siteConfig.githubReposUrl;

  /** null means "all languages". */
  protected readonly language = signal<string | null>(null);

  protected readonly visible = computed(() => {
    const language = this.language();
    const projects = this.service.projects();
    return language ? projects.filter((project) => project.language === language) : projects;
  });

  protected select(language: string | null) {
    this.language.set(language);
  }
}
