import { ApplicationPaths } from '@/components/home/application-paths'
import { FinalContact } from '@/components/home/final-contact'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { HomeFaq } from '@/components/home/home-faq'
import { ManufacturingEvidence } from '@/components/home/manufacturing-evidence'
import { MaterialDifferentiators } from '@/components/home/material-differentiators'
import { MaterialFamilies } from '@/components/home/material-families'
import { QualityContext } from '@/components/home/quality-context'
import { RepresentativeProducts } from '@/components/home/representative-products'
import { SamplingProcess } from '@/components/home/sampling-process'
import { JsonLd } from '@/components/site/json-ld'
import { organizationSchema } from '@/lib/site'

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <HeroCarousel />
      <MaterialFamilies />
      <RepresentativeProducts />
      <ApplicationPaths />
      <ManufacturingEvidence />
      <MaterialDifferentiators />
      <QualityContext />
      <SamplingProcess />
      <HomeFaq />
      <FinalContact />
    </>
  )
}
