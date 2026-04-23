import { siGithub, siInstagram, siTiktok, siX, siYoutube } from 'simple-icons'

import { Separator } from '@/components/ui/separator'

import Logo from '@/components/logo'
import { SOCIAL_LINKS } from '@/consts'
import { withBasePath } from '@/lib/paths'

const Footer = () => {
  return (
    <footer>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8 lg:px-8'>
        <a href={withBasePath('/#')}>
          <div className='flex items-center gap-3'>
            <Logo className='gap-3' />
          </div>
        </a>
        <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-2 whitespace-nowrap sm:gap-5'>
          <a
            href='#'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            Support
          </a>
          <a
            href='#'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            Terms & Conditions
          </a>
          <a
            href='#'
            className='text-muted-foreground hover:text-foreground opacity-80 transition-opacity duration-300 hover:opacity-100'
          >
            Privacy Policy
          </a>
        </div>

        <div className='flex items-center gap-4'>
          <a
            href={SOCIAL_LINKS.github}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground'
          >
            <svg viewBox='0 0 24 24' aria-hidden='true' className='size-5 fill-current'>
              <path d={siGithub.path} />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground'
          >
            <svg viewBox='0 0 24 24' aria-hidden='true' className='size-5 fill-current'>
              <path d={siInstagram.path} />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground'
          >
            <svg viewBox='0 0 24 24' aria-hidden='true' className='size-5 fill-current'>
              <path d={siX.path} />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground'
          >
            <svg viewBox='0 0 24 24' fill='currentColor' className='size-5' aria-hidden='true'>
              <path d='M6.94 8.5A1.56 1.56 0 1 1 6.94 5.4a1.56 1.56 0 0 1 0 3.1zM5.5 9.75h2.88V18H5.5V9.75zM10.1 9.75h2.76v1.12h.04c.38-.72 1.33-1.48 2.74-1.48 2.93 0 3.47 1.93 3.47 4.44V18h-2.88v-3.7c0-.88-.02-2.01-1.22-2.01-1.22 0-1.4.95-1.4 1.95V18H10.1V9.75z' />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground'
          >
            <svg viewBox='0 0 24 24' aria-hidden='true' className='size-5 fill-current'>
              <path d={siTiktok.path} />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.youtube}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground'
          >
            <svg viewBox='0 0 24 24' aria-hidden='true' className='size-5 fill-current'>
              <path d={siYoutube.path} />
            </svg>
          </a>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6 lg:px-8'>
        <p className='flex items-center gap-1 text-center font-medium text-balance max-sm:flex-col'>
          <span>
            {`©${new Date().getFullYear()}`}{' '}
            <a className='hover:underline' href={withBasePath('/#')}>
              Ravenwhisp Studio -
            </a>
          </span>
          <span> Made with ❤️ by indie developers</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
