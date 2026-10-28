import type { Certificate } from './types'

/** English certificate copies supplied for this customer; values are transcribed from those copies. */
export const certificates: Certificate[] = [
  {
    slug: 'iso-14001',
    standard: 'ISO 14001',
    title: 'Environmental management system',
    certificateNumber: '69024E0155ROS',
    issuingBody: null,
    scope: 'Manufacturing and sales of automotive interior lightweight GMT materials and related environmental management activities',
    validUntil: '5 June 2027, subject to the certificate terms',
    scanSrc: '/images/certificates/iso-14001-english.jpg',
  },
  {
    slug: 'iatf-16949',
    standard: 'IATF 16949',
    title: 'Automotive quality management system',
    certificateNumber: '133961/A/0001/SM/En',
    issuingBody: 'URS',
    scope: 'Manufacture of plastic sheets used for interior trim parts (lightweight GMT material, plant fiber composite material, PET material); excludes product design under clause 8.3',
    validUntil: '28 June 2027, subject to the certificate terms',
    scanSrc: '/images/certificates/iatf-16949-english.jpg',
  },
]
