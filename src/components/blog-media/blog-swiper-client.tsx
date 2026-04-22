'use client'

import { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { A11y, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { withBasePath } from '@/lib/paths'

import 'swiper/css'
import 'swiper/css/pagination'

export type BlogSwiperSlide = {
  src: string
  alt: string
  caption?: string
}

type Props = {
  slides: BlogSwiperSlide[]
}

type SwiperControls = {
  slidePrev: () => void
  slideNext: () => void
}

export default function BlogSwiperClient({ slides }: Props) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperControls | null>(null)

  const slidePrev = () => {
    swiperInstance?.slidePrev()
  }

  const slideNext = () => {
    swiperInstance?.slideNext()
  }

  return (
    <div className='blog-swiper-wrap border-border bg-card my-8 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='relative'>
        <Swiper
          modules={[A11y, Pagination]}
          onSwiper={setSwiperInstance}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={16}
          className='blog-swiper'
        >
          {slides.map(slide => (
            <SwiperSlide key={slide.src}>
              <figure className='space-y-3 p-3 sm:p-4'>
                <div className='overflow-hidden rounded-2xl'>
                  <img
                    src={withBasePath(slide.src)}
                    alt={slide.alt}
                    className='h-auto w-full object-cover'
                    loading='lazy'
                    decoding='async'
                  />
                </div>
                {slide.caption && (
                  <figcaption className='text-muted-foreground px-1 text-sm leading-6'>{slide.caption}</figcaption>
                )}
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type='button'
          onClick={slidePrev}
          aria-label='Previous slide'
          className='bg-background/90 text-foreground hover:bg-background border-border absolute top-1/2 left-4 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition lg:flex'
        >
          <ChevronLeftIcon className='size-5' />
        </button>

        <button
          type='button'
          onClick={slideNext}
          aria-label='Next slide'
          className='bg-background/90 text-foreground hover:bg-background border-border absolute top-1/2 right-4 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition lg:flex'
        >
          <ChevronRightIcon className='size-5' />
        </button>
      </div>
    </div>
  )
}
