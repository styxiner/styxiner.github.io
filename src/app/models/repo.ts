export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  languages: string[] | null;
  stargazers_count: number;
  topics: string[];
  fork: boolean;
}
