import type { Product, SpecField } from './types'

/** Product specifications and MOQ follow the matching row (4–11) in the supplied workbook. */
const field = (
  key: string,
  label: string,
  unit?: string,
  note?: string,
): SpecField => ({ key, label, unit, value: null, note })

const spec = (key: string, label: string, value: string, unit?: string): SpecField => ({ key, label, value, unit })
const sourceMoq = { value: 500, unit: 'pcs' } as const
const sourceImages = (slug: string, count: number, name: string) =>
  Array.from({ length: count }, (_, index) => ({
    src: `/images/products/source/${slug}-${index + 1}.jpeg`,
    alt: `${name}, customer-supplied product photo ${index + 1}`,
    kind: index === 0 ? 'full' as const : 'detail' as const,
  }))

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
      spec('thickness', 'Thickness', '1.5–6', 'mm'),
      spec('areal-weight', 'Areal weight', '500–3000', 'g/m²'),
      field('glass-content', 'Glass fiber content', '%'),
      spec('width', 'Width', 'up to 2000', 'mm'),
      spec('surface', 'Color', 'Black or white'),
    ],
    moq: sourceMoq,
    images: sourceImages('pp-glass-fiber-board', 5, 'PP glass fiber board'),
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
      spec('thickness', 'Thickness', '1.5–6', 'mm'),
      spec('areal-weight', 'Areal weight', '500–3000', 'g/m²'),
      field('glass-content', 'Glass fiber content', '%'),
      spec('width', 'Width', 'up to 2000', 'mm'),
      spec('color', 'Color', 'Black or white'),
      field(
        'thermal-expansion',
        'Thermal expansion ratio',
        undefined,
        'Confirm against the current technical data sheet.',
      ),
    ],
    moq: sourceMoq,
    images: [],
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
      spec('areal-weight', 'Areal weight', '500–3000', 'g/m²'),
      spec('thickness', 'Thickness', '1.5–6', 'mm'),
      spec('width', 'Width', 'up to 2000', 'mm'),
      spec('color', 'Color', 'Black or white'),
      field('orientation', 'Fiber orientation'),
    ],
    moq: sourceMoq,
    images: sourceImages('lwrtud-felt-sheet', 2, 'LWRTUD felt or sheet'),
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
      spec('thickness', 'Thickness', '6–10', 'mm'),
      spec('areal-weight', 'Areal weight', '500–3000', 'g/m²'),
      field('ratio', 'PET / PP composition'),
      spec('width', 'Width', 'up to 2000', 'mm'),
      spec('color', 'Color', 'Black or white'),
    ],
    moq: sourceMoq,
    images: sourceImages('pet-pp-composite-sheet', 4, 'PET/PP composite sheet'),
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
      spec('areal-weight', 'Areal weight', '100–500', 'g/m²'),
      spec('thickness', 'Thickness', '1–3', 'mm'),
      spec('width', 'Width', 'up to 2000', 'mm'),
      spec('color', 'Color', 'Black or white'),
    ],
    moq: sourceMoq,
    images: sourceImages('pet-non-woven-pile-carpet', 2, 'PET non-woven or pile carpet'),
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
      spec('thickness', 'Panel thickness', '6–25', 'mm'),
      field('panel-size', 'Panel size', 'mm'),
      field('face', 'Face material'),
      field('core', 'Core structure'),
      spec('color', 'Color', 'Black'),
    ],
    moq: sourceMoq,
    images: sourceImages('phc-fiberglass-composite-panel', 5, 'PHC fiberglass composite panel'),
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
      spec('thickness', 'Thickness', '1.5–6', 'mm'),
      spec('areal-weight', 'Areal weight', '500–2000', 'g/m²'),
      field('fiber-content', 'Natural fiber content', '%'),
      spec('width', 'Width', 'up to 2000', 'mm'),
      spec('color', 'Color', 'White'),
    ],
    moq: sourceMoq,
    images: sourceImages('pp-bamboo-hemp-fiberboard', 3, 'PP bamboo or hemp fiberboard'),
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
      spec('thickness', 'Thickness', '6–25', 'mm'),
      field('density', 'Density', 'kg/m³'),
      field('panel-size', 'Panel size', 'mm'),
      spec('color', 'Color', 'Black'),
    ],
    moq: sourceMoq,
    images: sourceImages('pet-foam-board', 2, 'PET foam board'),
    relatedSlugs: ['phc-fiberglass-composite-panel', 'pet-pp-composite-sheet'],
    status: 'published',
  },
]
