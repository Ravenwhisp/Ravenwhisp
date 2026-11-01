import { Button } from '@/components/ui/button'
import HeroScene from '@/components/blocks/hero-section/hero-scene'
import { withBasePath } from '@/lib/paths'

const HeroSection = () => {
  return (
    <section id='home' aria-labelledby='home-title' className='relative z-20 h-[calc(100vh-4rem)] overflow-visible'>
      <div className='absolute inset-0'>
        <HeroScene />
      </div>

      <img
        src={withBasePath('/images/DeathAndLyriel.png')}
        alt='Death with its scythe and Lyriel drawing her bow'
        width={2852}
        height={2139}
        className='pointer-events-none absolute right-0 -bottom-4 z-10 h-auto w-2/3 object-contain object-bottom md:-bottom-16 md:h-[calc((100%-4rem)*2/3)] md:w-auto'
      />

      <div className='pointer-events-none relative isolate z-50 mx-auto flex h-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative z-50 flex max-w-3xl flex-col gap-5 self-center text-center lg:text-left'>
          <h1
            id='home-title'
            className='text-primary-foreground text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl'
          >
            Bound By Death
          </h1>
          <p className='text-primary-foreground text-xl font-medium sm:text-2xl'>Face The Past, Save The Future</p>
          <p className='text-primary-foreground/85 max-w-2xl text-lg leading-relaxed sm:text-xl'>
            A dark fantasy hack-and-slash with two-player local co-op. Take on the roles of Lyriel and Death, combining
            ranged precision and melee strength to face the consequences of a forbidden ritual.
          </p>
          <div className='relative z-50 flex flex-col justify-center gap-3 py-1 sm:flex-row lg:justify-start'>
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
      </div>
    </section>
  )
}

export default HeroSection
