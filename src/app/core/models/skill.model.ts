import type { Translations } from '../../i18n/es';

/** Every flag needs a translated title in skills.groups of each dictionary. */
export type SkillFlag = keyof Translations['skills']['groups'];

export interface Skill {
  name: string;
  /** Hex colour for the small square next to the name. Optional. */
  color?: string;
}

export interface SkillGroup {
  /** Shown as a long flag, e.g. 'frontend' renders as --frontend. */
  flag: SkillFlag;
  skills: Skill[];
}
