import type { Certificate } from './types'

/**
 * Certificate values are editable and stay `null` until checked against the
 * supplied scans. Null values render as "shown on the certificate copy".
 * Set `scanSrc` (e.g. an R2 URL) to display the scan.
 */
export const certificates: Certificate[] = [
  {
    slug: 'iso-14001',
    standard: 'ISO 14001',
    title: 'Environmental management system',
    certificateNumber: null,
    issuingBody: null,
    scope: null,
    validUntil: null,
    scanSrc: null,
  },
  {
    slug: 'iatf-16949',
    standard: 'IATF 16949',
    title: 'Automotive quality management system',
    certificateNumber: null,
    issuingBody: null,
    scope: null,
    validUntil: null,
    scanSrc: null,
  },
]
