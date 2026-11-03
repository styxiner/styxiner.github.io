import { Project } from '../core/models/project.model';

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    slug: 'shelltext',
    title: 'ShellText',
    description: 'Editor de texto para terminal.',
    imageUrl: null,
    repoUrl: 'https://github.com/styxiner/ShellText',
    liveUrl: null,
    language: 'Python',
    topics: [],
    featured: false,
    archived: false,
    updatedAt: '2024-09-29T10:00:00Z',
    repos: [],
    ...overrides,
  };
}
