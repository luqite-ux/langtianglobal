import type { Product, SpecField } from './types'

/**
 * Sample product rows. Spec values are intentionally `null` until each figure
 * is copied from the matching source row; never reuse one product's values for
 * another. MOQ is stored per product for the same reason.
 */
const field = (
  key: string,
  label: string,
  unit?: string,
  note?: string,
): SpecField => ({ key, label, unit, value: null, note })

const noMoq = { value: null, unit: null } as const

export const products: Product[] = [
  {
    slug: 'pp-glass-fiber-board',
    name: 'PP Glass Fiber Board',
    categorySlug: 'sheet',
    form: 'Sheet',
    summary:
      'Polypropylene-based board reinforced with glass fiber, supplied as a flat sheet for forming into interior structures.',
    description: [
      'PP Glass Fiber Board combines a polypropylene (PP) thermoplastic matrix with glass-fiber reinforcement in flat sheet form.',
      'Thickness, areal weight, sheet size and surface requirements are agreed against your part drawing and forming route during the inquiry.',
    ],
    highlights: [
      'PP matrix with glass-fiber reinforcement',
      'Supplied as flat sheet',
      'Specification confirmed per inquiry',
    ],
    applicationSlugs: [
      'door-panels',
      'luggage-compartment-liners',
      'spare-tire-covers',
    ],
    specs: [
      field('thickness', 'Thickness', 'mm'),
      field('areal-weight', 'Areal weight', 'g/m²'),
      field('glass-content', 'Glass fiber content', '%'),
      field('sheet-size', 'Sheet size', 'mm'),
      field('surface', 'Surface / color'),
    ],
    moq: noMoq,
    images: [],
    relatedSlugs: ['lwrt-board', 'pet-pp-composite-sheet'],
    status: 'published',
  },
  {
    slug: 'lwrt-board',
    name: 'LWRT Board',
    categorySlug: 'sheet',
    form: 'Sheet',
    summary:
      'Lightweight reinforced thermoplastic (LWRT) board, a fiber-reinforced thermoplastic sheet for lightweight interior parts.',
    description: [
      'LWRT stands for lightweight reinforced thermoplastic. The board is a fiber-reinforced thermoplastic sheet intended for lightweight automotive interior parts.',
      'Grade, thickness, areal weight and facing options are confirmed against the current technical data sheet and your part requirements.',
    ],
    highlights: [
      'Fiber-reinforced thermoplastic sheet',
      'Considered for headliner, door-panel and liner parts',
      'Grade and facing confirmed per inquiry',
    ],
    applicationSlugs: [
      'headliners',
      'door-panels',
      'luggage-compartment-liners',
      'spare-tire-covers',
    ],
    specs: [
      field('thickness', 'Thickness', 'mm'),
      field('areal-weight', 'Areal weight', 'g/m²'),
      field('glass-content', 'Glass fiber content', '%'),
      field('sheet-size', 'Sheet size', 'mm'),
      field('facing', 'Facing / surface layer'),
      field(
        'thermal-expansion',
        'Thermal expansion ratio',
        undefined,
        'Confirm against the current technical data sheet.',
      ),
    ],
    moq: noMoq,
    images: [
      {
        src: '/images/products/glass-fibre-surface.jpg',
        alt: 'Surface detail of a dark composite sheet with visible white fibers and a cut curved edge',
        kind: 'detail',
      },
    ],
    relatedSlugs: ['lwrtud-felt-sheet', 'pp-glass-fiber-board'],
    notes: [
      'No thermal expansion multiplier is published on this page. The figure depends on grade and is stated on the technical data sheet.',
    ],
    status: 'published',
  },
  {
    slug: 'lwrtud-felt-sheet',
    name: 'LWRTUD Felt / Sheet',
    categorySlug: 'felt',
    form: 'Felt or sheet',
    summary:
      'LWRTUD material supplied as felt or sheet, specified per project.',
    description: [
      'LWRTUD is offered as a felt or sheet form. Construction details and fiber orientation are confirmed against the technical data sheet for the grade you need.',
      'Share your target thickness, areal weight and part geometry so the right form can be proposed.',
    ],
    highlights: [
      'Felt or sheet form',
      'Specification confirmed per inquiry',
      'Sample discussion available through inquiry',
    ],
    applicationSlugs: [
      'spare-tire-covers',
      'luggage-compartment-liners',
      'other-interior-structures',
    ],
    specs: [
      field('form', 'Form (felt or sheet)'),
      field('areal-weight', 'Areal weight', 'g/m²'),
      field('thickness', 'Thickness', 'mm'),
      field('width', 'Width', 'mm'),
      field('orientation', 'Fiber orientation'),
    ],
    moq: noMoq,
    images: [
      {
        src: '/images/products/felt-black.jpg',
        alt: 'Folded black felt material',
        kind: 'full',
      },
    ],
    relatedSlugs: ['lwrt-board', 'pet-non-woven-pile-carpet'],
    status: 'published',
  },
  {
    slug: 'pet-pp-composite-sheet',
    name: 'PET/PP Composite Sheet',
    categorySlug: 'sheet',
    form: 'Sheet',
    summary:
      'Composite sheet combining PET and PP components for interior structure and lining parts.',
    description: [
      'PET/PP Composite Sheet combines PET and PP in a single sheet material.',
      'Component ratio, thickness, areal weight and surface are confirmed per inquiry.',
    ],
    highlights: [
      'PET and PP in one sheet',
      'Specification confirmed per inquiry',
    ],
    applicationSlugs: ['headliners', 'other-interior-structures'],
    specs: [
      field('thickness', 'Thickness', 'mm'),
      field('areal-weight', 'Areal weight', 'g/m²'),
      field('ratio', 'PET / PP composition'),
      field('sheet-size', 'Sheet size', 'mm'),
    ],
    moq: noMoq,
    images: [],
    relatedSlugs: ['pp-glass-fiber-board', 'pet-foam-board'],
    status: 'published',
  },
  {
    slug: 'pet-non-woven-pile-carpet',
    name: 'PET Non-woven / Pile Carpet',
    categorySlug: 'felt',
    form: 'Non-woven or pile carpet',
    summary:
      'PET non-woven and pile carpet materials for interior surface and lining layers.',
    description: [
      'PET non-woven and pile carpet materials are supplied for interior surface and lining layers.',
      'Surface type, color, areal weight, width and roll length are confirmed per inquiry.',
    ],
    highlights: [
      'PET non-woven and pile carpet forms',
      'Surface layer for interior linings',
      'Color and weight confirmed per inquiry',
    ],
    applicationSlugs: ['luggage-compartment-liners', 'other-interior-structures'],
    specs: [
      field('type', 'Type (non-woven or pile)'),
      field('areal-weight', 'Areal weight', 'g/m²'),
      field('thickness', 'Thickness', 'mm'),
      field('width', 'Width', 'mm'),
      field('color', 'Color'),
    ],
    moq: noMoq,
    images: [
      {
        src: '/images/products/felt-grey.jpg',
        alt: 'Flat grey felt sheet',
        kind: 'full',
      },
    ],
    relatedSlugs: ['lwrtud-felt-sheet', 'pet-foam-board'],
    status: 'published',
  },
  {
    slug: 'phc-fiberglass-composite-panel',
    name: 'PHC Fiberglass Composite Panel',
    categorySlug: 'sandwich',
    form: 'Sandwich panel',
    summary:
      'Fiberglass composite panel in a sandwich construction, with face layers around a core.',
    description: [
      'PHC Fiberglass Composite Panel is a sandwich-construction panel with fiberglass composite face layers around a core.',
      'Panel thickness, size, face material and core details are confirmed per inquiry.',
    ],
    highlights: [
      'Sandwich construction',
      'Fiberglass composite faces',
      'Panel size and thickness confirmed per inquiry',
    ],
    applicationSlugs: [
      'headliners',
      'luggage-compartment-liners',
      'other-interior-structures',
    ],
    specs: [
      field('thickness', 'Panel thickness', 'mm'),
      field('panel-size', 'Panel size', 'mm'),
      field('face', 'Face material'),
      field('core', 'Core structure'),
      field('areal-weight', 'Areal weight', 'g/m²'),
    ],
    moq: noMoq,
    images: [
      {
        src: '/images/products/sandwich-sheet.jpg',
        alt: 'Dark-faced composite panel seen from the edge, showing a light-colored core',
        kind: 'full',
      },
    ],
    relatedSlugs: ['pet-foam-board', 'pp-glass-fiber-board'],
    status: 'published',
  },
  {
    slug: 'pp-bamboo-hemp-fiberboard',
    name: 'PP Bamboo / Hemp Fiberboard',
    categorySlug: 'natural-fiber',
    form: 'Board',
    summary:
      'Polypropylene fiberboard reinforced with natural bamboo or hemp fibers.',
    description: [
      'PP Bamboo / Hemp Fiberboard uses a polypropylene matrix with natural bamboo or hemp fibers.',
      'Fiber type, thickness, areal weight and board size are confirmed per inquiry.',
    ],
    highlights: [
      'PP matrix with natural fibers',
      'Bamboo or hemp options',
      'Specification confirmed per inquiry',
    ],
    applicationSlugs: ['door-panels', 'other-interior-structures'],
    specs: [
      field('fiber-type', 'Natural fiber (bamboo or hemp)'),
      field('thickness', 'Thickness', 'mm'),
      field('areal-weight', 'Areal weight', 'g/m²'),
      field('fiber-content', 'Natural fiber content', '%'),
      field('board-size', 'Board size', 'mm'),
    ],
    moq: noMoq,
    images: [
      {
        src: '/images/products/natural-fibre-board.jpg',
        alt: 'Stack of tan natural-fiber board sheets',
        kind: 'full',
      },
    ],
    relatedSlugs: ['pp-glass-fiber-board', 'lwrt-board'],
    status: 'published',
  },
  {
    slug: 'pet-foam-board',
    name: 'PET Foam Board',
    categorySlug: 'sandwich',
    form: 'Foam board',
    summary: 'PET foam board for panel and core-type interior structures.',
    description: [
      'PET foam board is supplied as a foam panel material for core-type interior structures.',
      'Thickness, density, panel size and facing options are confirmed per inquiry.',
    ],
    highlights: [
      'PET foam panel material',
      'Core-type construction',
      'Specification confirmed per inquiry',
    ],
    applicationSlugs: ['headliners', 'other-interior-structures'],
    specs: [
      field('thickness', 'Thickness', 'mm'),
      field('density', 'Density', 'kg/m³'),
      field('panel-size', 'Panel size', 'mm'),
      field('facing', 'Facing options'),
    ],
    moq: noMoq,
    images: [],
    relatedSlugs: ['phc-fiberglass-composite-panel', 'pet-pp-composite-sheet'],
    status: 'published',
  },
]
