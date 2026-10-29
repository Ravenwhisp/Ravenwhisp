import { Button } from '@/components/ui/button'
import HeroScene from '@/components/blocks/hero-section/hero-scene'
import { withBasePath } from '@/lib/paths'

const HeroSection = () => {
  return (
    <section id='home' aria-labelledby='home-title' className='relative z-20 overflow-hidden'>
      <div className='absolute inset-0'>
        <HeroScene />
      </div>

      <div className='pointer-events-none relative z-20 mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-8 px-4 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24'>
        <div className='relative z-30 mx-auto flex max-w-xl flex-col gap-5 text-center lg:mx-0 lg:text-left'>
          <h1
            id='home-title'
            className='text-primary-foreground text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl'
          >
            Bound By Death
          </h1>
          <p className='text-primary-foreground text-xl font-medium sm:text-2xl'>Face The Past, Save The Future</p>
          <p className='text-primary-foreground/85 text-lg leading-relaxed sm:text-xl'>
            A dark fantasy hack-and-slash with two-player local co-op. Take on the roles of Lyriel and Death, combining
            ranged precision and melee strength to face the consequences of a forbidden ritual.
          </p>
          <div className='flex flex-col justify-center gap-3 py-1 sm:flex-row lg:justify-start'>
            <Button size='lg' className='pointer-events-auto text-base max-sm:w-full' asChild>
              <a href={withBasePath('/download')}>Download</a>
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='pointer-events-auto border-white/40 bg-transparent text-base text-white hover:bg-white/10 hover:text-white dark:bg-transparent dark:hover:bg-white/10'
              asChild
            >
              <a href={withBasePath('/blog')}>Follow Development</a>
            </Button>
          </div>
        </div>
        <img
          src={withBasePath('/images/DeathAndLyriel.png')}
          alt='Death with its scythe and Lyriel drawing her bow'
          width={2852}
          height={2139}
          className='pointer-events-none relative z-20 mx-auto -mb-8 h-auto w-full max-w-md object-contain lg:absolute lg:right-0 lg:bottom-0 lg:mb-0 lg:w-[52%] lg:max-w-none'
        />
      </div>
    </section>
  )
}

export default HeroSection
