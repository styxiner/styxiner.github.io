// Data that is the same in every language: name, links, synopsis flags.
// Everything you read on the site (texts, titles, labels) is in src/app/i18n.

export interface SocialLink {
  id: 'github' | 'instagram';
  label: string;
  handle: string;
  url: string;
}

export const siteConfig = {
  name: 'styxiner',
  /** Rendered as the SYNOPSIS line: styxiner [--build] [--audit] [--learn] idea */
  synopsisFlags: ['build', 'audit', 'learn'],

  social: [
    { id: 'github', label: 'GitHub', handle: '@styxiner', url: 'https://github.com/styxiner' },
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '@styxiner.dev',
      url: 'https://instagram.com/styxiner.dev',
    },
  ] satisfies SocialLink[],

  /** Set to your address to show a mailto row in Contact. null hides the link. */
  email: null as string | null,

  githubReposUrl: 'https://github.com/styxiner?tab=repositories',
};
