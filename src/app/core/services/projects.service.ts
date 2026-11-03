import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { Project, ProjectsFile } from '../models/project.model';

/**
 * Reads the static projects.json generated weekly by GitHub Actions.
 * The site never calls the GitHub API at runtime.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly file = httpResource<ProjectsFile>(() => 'data/projects.json');

  readonly isLoading = this.file.isLoading;
  readonly hasError = computed(() => this.file.status() === 'error');

  // value() throws while the resource is in an error state, so read it through hasValue().
  private readonly data = computed(() => (this.file.hasValue() ? this.file.value() : null));

  readonly projects = computed<Project[]>(() => this.data()?.projects ?? []);
  readonly activity = computed(() => this.data()?.activity ?? null);
  readonly generatedAt = computed(() => this.data()?.generatedAt ?? null);

  /** Languages present in the cards, most frequent first. Used for the filter bar. */
  readonly languages = computed(() => {
    const counts = new Map<string, number>();
    for (const project of this.projects()) {
      if (project.language) {
        counts.set(project.language, (counts.get(project.language) ?? 0) + 1);
      }
    }
    return [...counts].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  });
}
