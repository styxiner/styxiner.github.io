import { Translations } from './es';

export const en: Translations = {
  meta: {
    title: 'styxiner · security analyst and developer',
    description:
      'Portfolio of styxiner: security analyst and developer. Projects, stack, certifications and contact.',
  },

  nav: {
    skipLink: 'Skip to content',
    sections: 'Sections',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    online: 'online',
    items: {
      about: { label: 'about', hint: 'about me' },
      stack: { label: 'stack', hint: 'technologies' },
      projects: { label: 'projects', hint: 'repos' },
      certs: { label: 'certs', hint: 'certifications' },
      contact: { label: 'contact', hint: 'socials' },
    },
  },

  hero: {
    manual: 'Developer’s Manual',
    role: 'Security analyst and developer.',
    intro:
      'Cybersecurity practitioner and developer. I build tools, interfaces and services, and I care about understanding how they are protected.',
    synopsisLabel: 'SYNOPSIS',
    synopsisArgument: 'idea',
    philosophyLabel: 'PHILOSOPHY',
    philosophy: 'Understand how something works before trusting it.',
    cta: 'see projects',
    activity: 'Recent activity on GitHub',
    loadingActivity: 'reading projects.json…',
  },

  about: {
    label: 'Description',
    title: 'About me',
    paragraphs: [
      {
        title: 'Who I am.',
        text: 'I am a security analyst and software developer with a particular interest in automation and system protection. I am driven by solving real problems, improving processes and continuing to learn in a field that never stops changing.',
      },
      {
        title: 'Background.',
        text: 'I have worked in cybersecurity since March 2024, on automation, monitoring, incident detection and response, vulnerability management, audits and identity administration. I currently work on Complyx while I keep expanding my training and knowledge.',
      },
      {
        title: 'Focus.',
        text: 'My approach combines cybersecurity and software development: automating processes, improving operational efficiency and strengthening the security of systems. I am especially interested in proactive threat detection, risk management and building tools that help security teams.',
      },
    ],
    facts: [
      { key: 'role', value: 'Security analyst and developer' },
      { key: 'location', value: 'Spain' },
      { key: 'focus', value: 'Cybersecurity, software development' },
      { key: 'now', value: 'Preparing for CFHI, working on Complyx' },
      {
        key: 'interests',
        value:
          'Not just cybersecurity and development. I also enjoy playing the piano and practising martial arts!',
      },
    ],
  },

  skills: {
    label: 'Dependencies',
    title: 'Technologies and tools',
    empty: 'add in skills.config.ts',
    groups: {
      languages: 'Languages',
      frontend: 'Frontend',
      backend: 'Backend',
      security: 'Cybersecurity',
      tools: 'Tools',
      os: 'Operating systems',
    },
  },

  projects: {
    label: 'See also',
    title: 'Projects',
    synced: 'synced from github.com/styxiner',
    filter: 'Filter by language',
    loading: 'loading data/projects.json…',
    error: 'Could not read data/projects.json. The repositories are still on',
    empty: '# no public projects to show yet',
    featured: 'featured',
    noDescription: '# no description on GitHub',
    repositories: 'repositories',
    preview: 'Preview of',
    archived: 'archived',
    demo: 'demo',
  },

  certs: {
    label: 'Certifications',
    title: 'Certifications',
    completed: 'earned',
    inProgress: 'in progress',
    issuer: 'issuer',
    earnedOn: 'earned',
    verification: 'verification',
    verify: 'verify',
    pending: 'to be completed',
    noBadge: 'no badge',
    badge: 'Badge',
    next: 'next certification',
    descriptions: {
      cfhi: 'Currently studying for the certification.',
    },
  },

  contact: {
    label: 'Author',
    title: 'let’s talk',
    lede: 'If you want to talk about a project, an idea or anything security related, reach me on any of these channels.',
    open: 'open',
    write: 'write',
    email: 'Email',
  },

};
