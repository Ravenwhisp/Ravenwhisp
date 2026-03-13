'use client'

import { ArrowRightIcon, ArrowUpRightIcon, CalendarDaysIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import type { BlogPost } from '@/components/blocks/blog-component/blog-component'

interface HomeBlogPreviewProps {
  featuredPosts: BlogPost[]
  latestNonFeaturedPosts: BlogPost[]
}

const HomeBlogPreview = ({ featuredPosts, latestNonFeaturedPosts }: HomeBlogPreviewProps) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8'>
        <div className='space-y-3'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Read about our game development journey.</h2>
          <p className='text-muted-foreground max-w-2xl text-lg'>
            Updates, ideas, devlogs, and work in progress notes from the team.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {featuredPosts.map((item, index) => (
            <div key={`${item.author}-${index}`} className='group'>
              <Card className='cursor-default py-0 shadow-none'>
                <CardContent className='grid grid-cols-1 px-0 xl:grid-cols-2'>
                  <div className='p-6'>
                    <a href={`/blog/${item.slug}`} className='block h-59.5 w-full overflow-hidden rounded-lg'>
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        className='w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        loading='lazy'
                      />
                    </a>
                  </div>
                  <div className='flex flex-col justify-center gap-3 p-6'>
                    <div className='flex items-center gap-1.5 py-1'>
                      <div className='text-muted-foreground flex grow items-center gap-1.5'>
                        <CalendarDaysIcon className='size-5' />
                        <p>{item.pubDate}</p>
                      </div>
                      <div className='flex flex-col gap-1.5'>
                        <Badge className='bg-primary/10 text-primary border-0 text-sm'>{item.category}</Badge>
                        <Badge className='bg-secondary/10 text-secondary border-0 text-sm'>Featured</Badge>
                      </div>
                    </div>
                    <a href={`/blog/${item.slug}`}>
                      <h3 className='text-xl font-medium'>{item.title}</h3>
                    </a>

                    <p className='text-muted-foreground'>{item.description}</p>
                    <div className='flex w-full items-center justify-between gap-1 py-1'>
                      {item.authorUrl ? (
                        <a
                          href={item.authorUrl}
                          className='text-sm font-medium hover:underline'
                          onClick={e => {
                            e.stopPropagation()
                          }}
                        >
                          {item.author}
                        </a>
                      ) : (
                        <span className='cursor-pointer text-sm font-medium'>{item.author}</span>
                      )}
                      <Button
                        size='icon'
                        className='group-hover:bg-primary! bg-background text-foreground hover:bg-primary! hover:text-primary-foreground group-hover:text-primary-foreground border group-hover:border-transparent hover:border-transparent'
                        asChild
                      >
                        <a href={`/blog/${item.slug}`}>
                          <ArrowUpRightIcon />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <p className='text-muted-foreground max-w-2xl text-lg'>Latest Posts</p>

            <Button asChild variant='outline' className='rounded-xl'>
              <a href='/blog'>Read more posts</a>
            </Button>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {latestNonFeaturedPosts.map(post => (
              <a
                href={`/blog/${post.slug}`}
                key={post.id}
                className='group h-full cursor-pointer overflow-hidden shadow-none transition-all duration-300'
              >
                <Card className='h-full shadow-none'>
                  <CardContent className='space-y-3.5'>
                    <div className='mb-6 overflow-hidden rounded-lg sm:mb-10'>
                      <img
                        src={post.imageUrl}
                        alt={post.imageAlt}
                        className='h-59.5 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        loading='lazy'
                      />
                    </div>
                    <div className='flex items-center justify-between gap-1.5'>
                      <div className='text-muted-foreground flex items-center gap-1.5'>
                        <CalendarDaysIcon className='size-5' />
                        <span>{post.pubDate}</span>
                      </div>
                      <Badge className='bg-primary/10 text-primary border-0 text-sm'>{post.category}</Badge>
                    </div>
                    <h3 className='line-clamp-2 text-lg font-medium md:text-xl'>{post.title}</h3>
                    <p className='text-muted-foreground line-clamp-2'>{post.description}</p>
                    <div className='flex items-center justify-between'>
                      {post.authorUrl ? (
                        <a
                          href={post.authorUrl}
                          className='text-sm font-medium hover:underline'
                          onClick={e => {
                            e.stopPropagation()
                          }}
                        >
                          {post.author}
                        </a>
                      ) : (
                        <span className='text-sm font-medium'>{post.author}</span>
                      )}
                      <Button
                        size='icon'
                        className='group-hover:bg-primary! bg-background text-foreground hover:bg-primary! hover:text-primary-foreground group-hover:text-primary-foreground border group-hover:border-transparent hover:border-transparent'
                      >
                        <ArrowRightIcon className='size-4 -rotate-45' />
                        <span className='sr-only'>Read more: {post.title}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeBlogPreview
