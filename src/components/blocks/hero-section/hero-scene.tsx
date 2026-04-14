import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { withBasePath } from '@/lib/paths'

gsap.registerPlugin(ScrollTrigger)

const PARALLAX_STRENGTH = 15
const BACKGROUND_SCALE = 1.1
const MOBILE_SCROLL_END_X_PERCENT = -50

const HeroScene = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Desktop parallax on mouse move
  useEffect(() => {
    if (isMobile || !backgroundRef.current) return

    const backgroundElement = backgroundRef.current
    const animationState = { x: 0, y: 0 }

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const normalizedX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const normalizedY = ((e.clientY - rect.top) / rect.height - 0.5) * 2

      const targetX = normalizedX * PARALLAX_STRENGTH
      const targetY = normalizedY * PARALLAX_STRENGTH

      gsap.to(animationState, {
        x: targetX,
        y: targetY,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          gsap.set(backgroundElement, {
            transform: `scale(${BACKGROUND_SCALE}) translate(${animationState.x}px, ${animationState.y}px)`
          })
        }
      })
    }

    const handleMouseLeave = () => {
      gsap.to(animationState, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          gsap.set(backgroundElement, {
            transform: `scale(${BACKGROUND_SCALE}) translate(${animationState.x}px, ${animationState.y}px)`
          })
        }
      })
    }

    containerRef.current?.addEventListener('mousemove', handleMouseMove)
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove)
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave)
      gsap.killTweensOf(animationState)
    }
  }, [isMobile])

  // Mobile scroll parallax - background moves right as user scrolls
  useEffect(() => {
    if (!isMobile || !backgroundRef.current) return

    const heroSection = containerRef.current?.closest('section#home')
    if (!heroSection) return

    const backgroundElement = backgroundRef.current

    gsap.set(backgroundElement, {
      scale: BACKGROUND_SCALE,
      xPercent: 0,
      width: '200%',
      backgroundPosition: 'center center',
      transformOrigin: 'center'
    })

    const tween = gsap.to(backgroundElement, {
      xPercent: MOBILE_SCROLL_END_X_PERCENT,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '+=100%',
        scrub: true,
        pin: true,
        anticipatePin: 1
      }
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [isMobile])

  return (
    <div
      ref={containerRef}
      className='relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(226,201,233,0.48)_36%,rgba(58,27,66,0.16)_100%)]'
    >
      {/* Background Image with Scale and Parallax */}
      <div
        ref={backgroundRef}
        className='absolute inset-0'
        style={{
          backgroundImage: `url('${withBasePath('/images/home/hero/home-hero-background.png')}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: isMobile ? '200%' : '100%',
          transformOrigin: 'center'
        }}
      />

      {/* Corner Frames - Desktop Only */}
      {!isMobile && (
        <>
          {/* Top Left */}
          <img
            src={withBasePath('/images/home/hero/hh-tl.png')}
            alt=''
            className='pointer-events-none absolute top-[calc(100%/24)] left-[calc(100%/24)] z-30 h-[calc(100%/3)] w-auto'
            aria-hidden='true'
          />
          {/* Top Right */}
          <img
            src={withBasePath('/images/home/hero/hh-tr.png')}
            alt=''
            className='pointer-events-none absolute top-[calc(100%/24)] right-[calc(100%/24)] z-30 h-[calc(100%/3)] w-auto'
            aria-hidden='true'
          />
          {/* Bottom Left */}
          <img
            src={withBasePath('/images/home/hero/hh-bl.png')}
            alt=''
            className='pointer-events-none absolute bottom-[calc(100%/24)] left-[calc(100%/24)] z-30 h-[calc(100%/3)] w-auto'
            aria-hidden='true'
          />
          {/* Bottom Right */}
          <img
            src={withBasePath('/images/home/hero/hh-br.png')}
            alt=''
            className='pointer-events-none absolute right-[calc(100%/24)] bottom-[calc(100%/24)] z-30 h-[calc(100%/3)] w-auto'
            aria-hidden='true'
          />
        </>
      )}

      {/* Overlay Gradient */}
      <div className='pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-gray-900/90 via-gray-900/30 to-transparent' />
    </div>
  )
}

export default HeroScene
