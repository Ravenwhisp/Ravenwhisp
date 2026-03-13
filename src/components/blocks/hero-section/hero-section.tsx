import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const HeroSection = () => {
  return (
    <section id='home' className='bg-muted -mt-16 pt-32 pb-12 sm:pb-16 lg:pb-24'>
      <div className='mx-auto flex h-full max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8'>
        {/* Hero Header */}
        <div className='flex max-w-4xl flex-col items-center gap-4 self-center text-center'>
          <Badge variant='outline' className='text-sm font-normal'>
            Trusted by 1,000,000+ professionals
          </Badge>
          <h1 className='text-3xl leading-[1.29167] font-semibold text-balance sm:text-4xl lg:text-5xl'>
            Build Better Products with Insights that Drive Real Impact.
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            Learn how to design, develop, launch, and grow digital products through practical knowledge and proven
            frameworks.
          </p>
          <form className='gap-3 py-1 max-sm:w-full max-sm:space-y-2 sm:flex sm:flex-row md:w-sm'>
            <Input type='email' placeholder='Your email' className='bg-background h-10 flex-1 text-base' />
            <Button size='lg' className='text-base max-sm:w-full' asChild type='submit'>
              <a href='#'>Subscribe</a>
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
