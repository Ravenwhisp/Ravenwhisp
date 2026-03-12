'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { DownloadIcon, MenuIcon } from 'lucide-react'

import ThemeToggle from '@/components/layout/theme-toggle'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import MenuDropdown from '@/components/blocks/menu-dropdown'
import MenuNavigation from '@/components/blocks/menu-navigation'
import type { NavigationSection } from '@/components/blocks/menu-navigation'

import { cn } from '@/lib/utils'

import LogoSvg from '@/assets/svg/logo'

type HeaderProps = {
  navigationData: NavigationSection[]
  className?: string
}

const Header = ({ navigationData, className }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('/')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useLayoutEffect(() => {
    // Update activeSection based on the current route using window.location.pathname
    const path = window.location.pathname

    setTimeout(() => {
      if (path === '/' || path === '/#home') {
        setActiveSection('/')
      } else if (path.startsWith('/blog')) {
        setActiveSection('/blog')
      } else {
        setActiveSection(path)
      }
    }, 0)
  }, [])

  return (
    <header
      className={cn(
        'bg-background sticky top-0 z-50 h-16 w-full transition-all duration-300',
        {
          'shadow-sm': isScrolled
        },
        className
      )}
    >
      <div className='mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <a href='/#home' className='flex items-center gap-3'>
          <LogoSvg />
        </a>

        {/* Navigation */}
        <MenuNavigation navigationData={navigationData} activeSection={activeSection} className='max-lg:hidden' />

        {/* Actions */}
        <div className='flex gap-3'>
          <ThemeToggle />
          <Button variant='outline' className='max-sm:hidden' asChild>
            <a href='/download'>Download</a>
          </Button>

          {/* Navigation for small screens */}
          <div className='flex gap-3'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' className='sm:hidden' asChild>
                    <a href='/download'>
                      <DownloadIcon />
                      <span className='sr-only'>Download</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <MenuDropdown
              align='end'
              navigationData={navigationData}
              activeSection={activeSection}
              trigger={
                <Button variant='outline' size='icon' className='lg:hidden'>
                  <MenuIcon />
                  <span className='sr-only'>Menu</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
