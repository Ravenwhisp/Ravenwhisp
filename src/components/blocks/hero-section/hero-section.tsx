import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import HeroScene from '@/components/blocks/hero-section/hero-scene'
import { withBasePath } from '@/lib/paths'

const HeroSection = () => {
  return (
    <section
      id='home'
      className='relative -mt-16 min-h-screen overflow-hidden pt-32 pb-12 sm:pb-16 md:overflow-visible lg:pb-24'
    >
      <div className='absolute inset-0'>
        <HeroScene />
      </div>

      <img
        src={withBasePath('/images/DeathAndLyriel.png')}
        alt='Death and Lyriel'
        className='pointer-events-none absolute right-0 -bottom-8 z-10 h-4/5 w-auto object-contain object-bottom lg:-bottom-24'
      />

      <div className='pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex max-w-3xl flex-col gap-4 self-center text-center lg:text-left'>
          <h1 className='text-primary-foreground text-3xl leading-[1.29167] font-semibold text-balance sm:text-4xl lg:text-5xl'>
            Bound by Death
          </h1>
          <p className='text-primary-foreground/85 max-w-2xl text-xl'>
            Are you ready to accept your inevitable fate to save the world? Step into this cooperative hack-and-slash
            adventure and take on the roles of Lyriel, the elven heir to the throne, and Death itself, in a tale of the
            fear of letting go and the consequences of defying mortality..
          </p>
          <form className='gap-3 py-1 max-sm:w-full max-sm:space-y-2 sm:flex sm:flex-row md:w-sm lg:mx-0'>
            <Button size='lg' className='pointer-events-auto text-base max-sm:w-full' asChild>
              <a href={withBasePath('/download')}>Download</a>
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
