export type HeroSlide = {
  id: string
  eyebrow: string
  title: string
  text: string
  image: {
    src: string
    alt: string
    /** Focal position on small screens, where the photographed subject must stay in view. */
    mobilePosition: string
    /** Focal position on wide screens. */
    desktopPosition: string
  }
  /** Which side of the wide layout holds the copy, matched to the empty area of the photograph. */
  copySide: 'left' | 'right'
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'factory',
    eyebrow: "Xuyi County, Huai'an, Jiangsu",
    title: 'Thermoplastic composites for automotive interiors',
    text: 'Langtian was established in 2021 and makes thermoplastic composite sheets and felts. Send your part and specification to start an inquiry.',
    image: {
      src: '/images/banners/banner-factory.jpg',
      alt: 'Banner illustration of a modern industrial building with red accent lines at dusk',
      mobilePosition: '4% 50%',
      desktopPosition: '0% 50%',
    },
    copySide: 'right',
    primary: { label: 'Send an inquiry', href: '/contact' },
    secondary: { label: 'About Langtian', href: '/about' },
  },
  {
    id: 'production',
    eyebrow: 'Manufacturing',
    title: 'Needling and pressing lines behind sheet and felt',
    text: 'The source materials list five production lines in four workshops, made up of three needling lines and two pressing lines.',
    image: {
      src: '/images/banners/banner-production-line.jpg',
      alt: 'Banner illustration of a red-lit press line feeding pale composite sheets onto a conveyor',
      mobilePosition: '88% 50%',
      desktopPosition: '100% 50%',
    },
    copySide: 'left',
    primary: { label: 'See manufacturing', href: '/manufacturing' },
    secondary: { label: 'Send an inquiry', href: '/contact' },
  },
  {
    id: 'materials',
    eyebrow: 'Material families',
    title: 'Sheet, felt, sandwich and natural-fiber materials',
    text: 'Compare material families, open each product page for its own specification fields, then ask for the data you need.',
    image: {
      src: '/images/banners/banner-materials.jpg',
      alt: 'Banner illustration of stacked composite boards, felt and a felt roll on a deep red background',
      mobilePosition: '22% 50%',
      desktopPosition: '0% 50%',
    },
    copySide: 'right',
    primary: { label: 'Browse products', href: '/products' },
    secondary: { label: 'Request specification', href: '/contact' },
  },
]
