import { Certification } from '../core/models/certification.model';

// When you pass an exam: set status to 'completed', fill earnedOn and verifyUrl,
// and drop a badge image in public/images/certs/.
// The description of each certification is translated in src/app/i18n (certs.descriptions.<id>).

export const certifications: Certification[] = [
  {
    id: 'cfhi',
    name: 'CFHI',
    issuer: null,
    status: 'in-progress',
    earnedOn: null,
    badgeUrl: null,
    verifyUrl: null,
  },
];
