import type { ProductCategory } from './types'

export const categories: ProductCategory[] = [
  {
    slug: 'sheet',
    name: 'Composite sheets',
    summary:
      'Rigid and semi-rigid thermoplastic sheets, including glass-fiber reinforced PP and PET/PP grades.',
    image: {
      src: '/images/products/glass-fibre-surface.jpg',
      alt: 'Close-up of a dark composite sheet surface with visible white fibers',
    },
  },
  {
    slug: 'felt',
    name: 'Felts and non-wovens',
    summary:
      'Felt and non-woven materials supplied as sheet, roll or carpet-type surface layers.',
    image: {
      src: '/images/products/felt-grey.jpg',
      alt: 'Flat grey felt sheet',
    },
  },
  {
    slug: 'sandwich',
    name: 'Sandwich panels',
    summary:
      'Panels built from face layers around a core, including fiberglass composite and PET foam board.',
    image: {
      src: '/images/products/sandwich-sheet.jpg',
      alt: 'Dark-faced composite panel seen from the edge, showing a light-colored core',
    },
  },
  {
    slug: 'natural-fiber',
    name: 'Natural-fiber boards',
    summary:
      'Polypropylene boards reinforced with natural fibers such as bamboo or hemp.',
    image: {
      src: '/images/products/natural-fibre-board.jpg',
      alt: 'Stack of tan natural-fiber board sheets',
    },
  },
]
