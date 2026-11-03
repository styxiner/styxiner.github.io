import { SkillGroup } from '../core/models/skill.model';

// Technology names are the same in every language, so they live here.
// Group titles are translated in src/app/i18n (skills.groups.<flag>).
// An empty group renders a dashed "add here" chip, so the layout never breaks.

export const skillGroups: SkillGroup[] = [
  {
    flag: 'languages',
    skills: [
      { name: 'Python', color: '#6d9fd6' },
      { name: 'Rust', color: '#dea584' },
      { name: 'TypeScript', color: '#5b9be0' },
      { name: 'Java', color: '#d08b3c' },
      { name: 'PHP', color: '#474a8a' },
    ],
  },
  {
    flag: 'frontend',
    skills: [
      { name: 'Angular', color: '#dd5a6f' },
      { name: 'Electron', color: '#8fa3bf' },
      { name: 'Blade', color: '#474a8a' },
    ],
  },
  {
    flag: 'backend',
    skills: [
      { name: 'SpringBoot', color: '#d08b3c' },
      { name: 'Laravel', color: '#474a8a' },
    ],
  },
  {
    flag: 'security',
    skills: [
      { name: 'Threat Hunting', color: '#cbcbcb' },
      { name: 'Reverse Engineering', color: '#cbcbcb' },
    ],
  },
  {
    flag: 'tools',
    skills: [
      { name: 'OpenSearch', color: '#5b9be0' },
      { name: 'Wazuh', color: '#5b9be0' },
      { name: 'Owasp ZAP', color: '#dd5a6f' },
      { name: 'Ghidra', color: '#d08b3c' },
    ],
  },
  {
    flag: 'os',
    skills: [
      { name: 'Linux', color: '#cbcbcb' },
      { name: 'Proxmox', color: '#d08b3c' },
    ],
  },
];
