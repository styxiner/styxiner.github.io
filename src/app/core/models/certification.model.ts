import type { Translations } from '../../i18n/es';

export type CertificationStatus = 'in-progress' | 'completed';

export interface Certification {
  /** Key of its description in certs.descriptions of each dictionary. */
  id: keyof Translations['certs']['descriptions'];
  name: string;
  /** Leave null until you confirm who issues it; the card shows a placeholder. */
  issuer: string | null;
  status: CertificationStatus;
  /** ISO date (YYYY-MM-DD). Only shown when status is 'completed'. */
  earnedOn: string | null;
  /** Path under public/, e.g. 'images/certs/cfhi.svg'. */
  badgeUrl: string | null;
  verifyUrl: string | null;
}
