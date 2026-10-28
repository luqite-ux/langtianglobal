import type { Application } from './types'

export const applications: Application[] = [
  {
    slug: 'headliners',
    name: 'Automotive headliners',
    summary: 'Roof-lining substrates and sandwich-type headliner structures.',
    detail:
      'Headliner parts are usually judged on weight, stiffness, formability and how well the substrate accepts a decorative layer. Tell us your target thickness and layup so we can point to suitable material families.',
  },
  {
    slug: 'door-panels',
    name: 'Door panels',
    summary: 'Substrate boards for door-trim parts.',
    detail:
      'Door-trim parts often combine a formed substrate with a decorative surface. Share the part drawing, surface requirement and forming route to narrow the choice between sheet and natural-fiber options.',
  },
  {
    slug: 'luggage-compartment-liners',
    name: 'Luggage-compartment liners',
    summary: 'Lining and floor-type parts for the luggage compartment.',
    detail:
      'Luggage-compartment parts typically pair a structural layer with a felt or carpet-type surface. Felt and non-woven materials can be discussed together with the base sheet.',
    image: {
      src: '/images/applications/felt-faced-panel.jpg',
      alt: 'Dark teal felt-faced flat panel with die-cut notches and fastener holes',
      caption:
        'Representative sample photograph: a felt-faced flat panel with notches and fastener holes.',
    },
  },
  {
    slug: 'spare-tire-covers',
    name: 'Spare-tire covers',
    summary: 'Molded covers for the spare-tire well.',
    detail:
      'Spare-tire covers are molded parts, often with embossed features such as a circular recess. Material choice depends on the part geometry and the forming route you use.',
    image: {
      src: '/images/applications/molded-cover-stack.jpg',
      alt: 'Stack of dark molded composite parts with a circular embossed recess',
      caption:
        'Representative sample photograph: a stack of molded parts with a circular embossed recess.',
    },
  },
  {
    slug: 'other-interior-structures',
    name: 'Other interior structures',
    summary: 'Further interior parts that use sheet, felt or panel materials.',
    detail:
      'If your part is not listed, describe it in an inquiry. Suitability is confirmed against the relevant product source and your part requirements.',
  },
]
