import type { LocalizedText } from './localized.model';

// Shape of public/data/projects.json. The file is written by scripts/fetch-projects.mts,
// which imports these same types, so the generator and the frontend cannot drift apart.

export interface ProjectRepo {
  name: string;
  repoUrl: string;
  language: string | null;
  description: string | null;
}

export interface Project {
  slug: string;
  title: string;
  /** A string straight from GitHub, or { es, en } when translated in projects.config.json. */
  description: LocalizedText | null;
  imageUrl: string | null;
  repoUrl: string;
  liveUrl: string | null;
  language: string | null;
  topics: string[];
  featured: boolean;
  archived: boolean;
  updatedAt: string;
  /** Repositories merged into this card by a group in projects.config.json. Empty otherwise. */
  repos: ProjectRepo[];
}

export interface LanguageCount {
  name: string;
  count: number;
}

export interface GithubActivity {
  lastPushRepo: string;
  lastPushAt: string;
  publicRepos: number;
  memberSince: string;
  languages: LanguageCount[];
}

export interface ProjectsFile {
  generatedAt: string;
  user: string;
  activity: GithubActivity;
  projects: Project[];
}
