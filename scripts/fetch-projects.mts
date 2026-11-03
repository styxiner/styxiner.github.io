// Builds public/data/projects.json from the public GitHub repositories of the configured user.
//
//   node scripts/fetch-projects.mts            fetch and write (only if something changed)
//   node scripts/fetch-projects.mts --dry-run  fetch and print, never write
//
// GITHUB_TOKEN is optional locally. With it the script avoids the 60 requests/hour anonymous
// limit and can read custom social preview images (GraphQL needs authentication).
// On any error the script exits with code 1 and leaves the previous JSON untouched,
// so the published site keeps showing the last good data.

import { access, readFile, writeFile } from 'node:fs/promises';
import type {
  GithubActivity,
  LanguageCount,
  Project,
  ProjectRepo,
  ProjectsFile,
} from '../src/app/core/models/project.model.ts';
import type { LocalizedText } from '../src/app/core/models/localized.model.ts';

interface Override {
  title?: string;
  description?: LocalizedText;
  image?: string;
  liveUrl?: string;
  topics?: string[];
  featured?: boolean;
}

interface Group {
  slug: string;
  title: string;
  repos: string[];
  /** Repo whose language and description represent the group when not overridden. */
  primary: string;
  repoUrl: string;
  description?: LocalizedText;
}

interface Config {
  user: string;
  includeForks: boolean;
  exclude: string[];
  order: string[];
  groups: Group[];
  overrides: Record<string, Override>;
}

// Only the fields we use from GET /users/{user}/repos.
interface GithubRepo {
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

interface GithubUser {
  public_repos: number;
  created_at: string;
}

const root = new URL('../', import.meta.url);
const configPath = new URL('scripts/projects.config.json', root);
const outputPath = new URL('public/data/projects.json', root);
const imagesDir = new URL('public/images/projects/', root);
const imageExtensions = ['webp', 'png', 'jpg', 'jpeg', 'svg'];

const token = process.env['GITHUB_TOKEN'];
const dryRun = process.argv.includes('--dry-run');

async function github<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'styxiner-portfolio',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub ${response.status} on ${path}: ${body.slice(0, 200)}`);
  }
  return response.json() as Promise<T>;
}

async function fetchRepos(user: string): Promise<GithubRepo[]> {
  const repos: GithubRepo[] = [];
  for (let page = 1; ; page++) {
    const batch = await github<GithubRepo[]>(
      `/users/${user}/repos?type=owner&sort=pushed&per_page=100&page=${page}`,
    );
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

/** Custom social preview images, keyed by repo name. Empty without a token. */
async function fetchSocialPreviews(user: string): Promise<Map<string, string>> {
  const previews = new Map<string, string>();
  if (!token) {
    console.log('· sin GITHUB_TOKEN: se omiten las imágenes social preview');
    return previews;
  }

  const query = `query($login: String!) {
    user(login: $login) {
      repositories(first: 100, privacy: PUBLIC, ownerAffiliations: OWNER) {
        nodes { name openGraphImageUrl usesCustomOpenGraphImage }
      }
    }
  }`;

  try {
    const result = await github<{
      data?: {
        user: {
          repositories: {
            nodes: { name: string; openGraphImageUrl: string; usesCustomOpenGraphImage: boolean }[];
          };
        };
      };
    }>('/graphql', { method: 'POST', body: JSON.stringify({ query, variables: { login: user } }) });

    for (const node of result.data?.user.repositories.nodes ?? []) {
      // GitHub generates a preview for every repo; only hand-made ones are worth showing.
      if (node.usesCustomOpenGraphImage) previews.set(node.name, node.openGraphImageUrl);
    }
  } catch (error) {
    // Previews are decoration: a failure here must not block the update.
    console.warn(`· no se pudieron leer las social previews: ${(error as Error).message}`);
  }
  return previews;
}

async function localImage(slug: string): Promise<string | null> {
  for (const extension of imageExtensions) {
    const file = `${slug}.${extension}`;
    try {
      await access(new URL(file, imagesDir));
      return `images/projects/${file}`;
    } catch {
      // not there, try the next extension
    }
  }
  return null;
}

/**
 * Image priority:
 * 1. a file dropped in public/images/projects/<slug>.<ext>
 * 2. the repo's custom social preview on GitHub
 * 3. `image` in the override
 * 4. null, and the card draws its own fallback
 */
async function resolveImage(slug: string, previews: Map<string, string>, override?: Override) {
  return (await localImage(slug)) ?? previews.get(slug) ?? override?.image ?? null;
}

function toRepo(repo: GithubRepo): ProjectRepo {
  return {
    name: repo.name,
    repoUrl: repo.html_url,
    language: repo.language,
    description: repo.description,
  };
}

async function toProject(
  repo: GithubRepo,
  override: Override | undefined,
  previews: Map<string, string>,
): Promise<Project> {
  return {
    slug: repo.name,
    title: override?.title ?? repo.name,
    description: override?.description ?? repo.description,
    imageUrl: await resolveImage(repo.name, previews, override),
    repoUrl: repo.html_url,
    liveUrl: override?.liveUrl ?? (repo.homepage || null),
    language: repo.language,
    topics: override?.topics ?? repo.topics ?? [],
    featured: override?.featured ?? false,
    archived: repo.archived,
    updatedAt: repo.pushed_at,
    repos: [],
  };
}

async function toGroupProject(
  group: Group,
  members: GithubRepo[],
  override: Override | undefined,
  previews: Map<string, string>,
): Promise<Project> {
  const primary = members.find((repo) => repo.name === group.primary) ?? members[0];
  const latestPush = members
    .map((repo) => repo.pushed_at)
    .sort()
    .at(-1)!;
  const topics = [...new Set(members.flatMap((repo) => repo.topics ?? []))];

  return {
    slug: group.slug,
    title: override?.title ?? group.title,
    description: override?.description ?? group.description ?? primary.description,
    imageUrl: await resolveImage(group.slug, previews, override),
    repoUrl: group.repoUrl,
    liveUrl: override?.liveUrl ?? null,
    language: primary.language,
    topics: override?.topics ?? topics,
    featured: override?.featured ?? false,
    archived: members.every((repo) => repo.archived),
    updatedAt: latestPush,
    repos: members.map(toRepo),
  };
}

/** Pinned slugs first, in config order; everything else by most recent push. */
function sortProjects(projects: Project[], order: string[]): Project[] {
  const rank = (project: Project) => {
    const index = order.indexOf(project.slug);
    return index === -1 ? Number.POSITIVE_INFINITY : index;
  };
  return [...projects].sort((a, b) => rank(a) - rank(b) || b.updatedAt.localeCompare(a.updatedAt));
}

function countLanguages(repos: GithubRepo[]): LanguageCount[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function validateConfig(config: Config) {
  const seen = new Set<string>();
  for (const group of config.groups) {
    for (const name of group.repos) {
      if (seen.has(name)) throw new Error(`"${name}" aparece en más de un grupo`);
      seen.add(name);
    }
    if (!group.repos.includes(group.primary)) {
      throw new Error(`el grupo "${group.slug}" tiene primary "${group.primary}" fuera de repos`);
    }
  }
}

async function build(config: Config): Promise<Omit<ProjectsFile, 'generatedAt'>> {
  const [user, allRepos, previews] = await Promise.all([
    github<GithubUser>(`/users/${config.user}`),
    fetchRepos(config.user),
    fetchSocialPreviews(config.user),
  ]);

  const excluded = new Set(config.exclude);
  const repos = allRepos.filter(
    (repo) => !excluded.has(repo.name) && (config.includeForks || !repo.fork),
  );
  const byName = new Map(repos.map((repo) => [repo.name, repo]));
  const grouped = new Set(config.groups.flatMap((group) => group.repos));

  // Repo names are case-sensitive; a typo would silently drop the override.
  const slugs = new Set([...byName.keys(), ...config.groups.map((group) => group.slug)]);
  for (const key of Object.keys(config.overrides)) {
    if (!slugs.has(key)) console.warn(`· override "${key}" no coincide con ningún repo ni grupo`);
  }

  const projects: Project[] = [];
  for (const group of config.groups) {
    const members = group.repos.flatMap((name) => byName.get(name) ?? []);
    if (members.length === 0) {
      console.warn(`· el grupo "${group.slug}" no tiene repos públicos, se omite`);
      continue;
    }
    projects.push(await toGroupProject(group, members, config.overrides[group.slug], previews));
  }
  for (const repo of repos) {
    if (!grouped.has(repo.name)) {
      projects.push(await toProject(repo, config.overrides[repo.name], previews));
    }
  }

  const latest = repos.reduce<GithubRepo | undefined>(
    (newest, repo) => (!newest || repo.pushed_at > newest.pushed_at ? repo : newest),
    undefined,
  );
  const activity: GithubActivity = {
    lastPushRepo: latest?.name ?? '',
    lastPushAt: latest?.pushed_at ?? '',
    publicRepos: user.public_repos,
    memberSince: user.created_at,
    languages: countLanguages(repos),
  };

  return { user: config.user, activity, projects: sortProjects(projects, config.order) };
}

async function readPrevious(): Promise<ProjectsFile | null> {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8')) as ProjectsFile;
  } catch {
    return null;
  }
}

async function main() {
  const config = JSON.parse(await readFile(configPath, 'utf8')) as Config;
  validateConfig(config);

  const next = await build(config);
  const previous = await readPrevious();

  // An empty answer after a good one is far more likely an API hiccup than reality.
  if (next.projects.length === 0 && (previous?.projects.length ?? 0) > 0) {
    throw new Error('GitHub devolvió 0 proyectos; se conserva el JSON anterior');
  }

  console.log(
    `· ${next.projects.length} proyectos: ${next.projects.map((p) => p.slug).join(', ')}`,
  );

  if (previous) {
    const { generatedAt: _ignored, ...previousContent } = previous;
    if (JSON.stringify(previousContent) === JSON.stringify(next)) {
      console.log('· sin cambios, no se escribe el archivo');
      return;
    }
  }

  const file: ProjectsFile = { generatedAt: new Date().toISOString(), ...next };
  const json = JSON.stringify(file, null, 2) + '\n';

  if (dryRun) {
    console.log(json);
    return;
  }
  await writeFile(outputPath, json);
  console.log(`· escrito ${outputPath.pathname}`);
}

main().catch((error: Error) => {
  console.error(`✗ ${error.message}`);
  process.exitCode = 1;
});
