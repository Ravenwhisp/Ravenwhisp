import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import HeroScene from '@/components/blocks/hero-section/hero-scene'
import { withBasePath } from '@/lib/paths'

const HeroSection = () => {
  return (
    <section id='home' className='relative z-20 h-[calc(100vh-4rem)] overflow-visible'>
      <div className='absolute inset-0'>
        <HeroScene />
      </div>

      <img
        src={withBasePath('/images/DeathAndLyriel.png')}
        alt='Death and Lyriel'
        className='pointer-events-none absolute right-0 -bottom-4 z-30 h-auto w-2/3 object-contain object-bottom md:-bottom-16 md:h-[calc((100%-4rem)*2/3)] md:w-auto'
      />

      <div className='pointer-events-none relative z-20 mx-auto flex h-full max-w-7xl px-4 sm:px-6 lg:px-8'>
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
