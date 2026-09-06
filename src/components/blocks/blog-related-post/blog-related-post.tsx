'use client'

import { ArrowRightIcon, CalendarDaysIcon } from 'lucide-react'

import { getCollection } from 'astro:content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { withBasePath } from '@/lib/paths'
import { AuthorMetadata } from '@/components/AuthorAvatar'

import type { BlogPost } from '@/components/blocks/blog-component/blog-component'

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog')

  return blogEntries.map(entry => ({
    params: { slug: entry.id },
    props: { entry }
  }))
}

const Blog = ({ relatedPosts }: { relatedPosts: BlogPost[] }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 lg:px-8'>

        {/* Header */}
        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            Related Posts
          </h2>

          <p className='text-muted-foreground text-lg md:text-xl'>
            Learn more about the behind-the-scenes of Ravenwhisp's development.
          </p>
        </div>

        {/* Related Posts Grid */}
        <div className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {relatedPosts.map(post => (
            <a
              href={withBasePath(`/blog/${post.slug}`)}
              key={post.id}
              className='group block h-full w-full'
            >
              <Card className='h-full w-full shadow-none transition-all duration-300'>

                <CardContent className='flex h-full flex-col space-y-3.5'>

                  {/* Image */}
                  <div className='mb-6 overflow-hidden rounded-lg sm:mb-12'>
                    <img
                      src={withBasePath(post.imageUrl)}
                      alt={post.imageAlt}
                      className='h-59.5 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      loading='lazy'
                    />
                  </div>

                  {/* Date and Categories */}
                  <div className='flex items-center justify-between gap-1.5'>
                    <div className='text-muted-foreground flex items-center gap-1.5'>
                      <CalendarDaysIcon className='size-5' />
                      <span>{post.pubDate}</span>
                    </div>

                    <div className='flex flex-wrap justify-end gap-1.5'>
                      {post.categories.map(category => (
                        <Badge
                          key={category}
                          className='bg-primary/10 text-primary border-0 text-sm'
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className='line-clamp-2 text-lg font-medium md:text-xl'>
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className='text-muted-foreground line-clamp-2'>
                    {post.description}
                  </p>

                  {/* Author + Read More */}
                  <div className='mt-auto flex items-center justify-between pt-6'>

                    {/* Authors */}
                    <div className='flex flex-wrap gap-4'>
                      {post.authors &&
                        post.authors.length > 0 &&
                        post.authors.map((author, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2'
                          >
                            <AuthorMetadata
                              avatarFullUrl={author.avatarUrl}
                              author={author.name}
                            />

                            <div className='flex flex-col gap-0.5'>
                              <span className='text-foreground text-sm font-medium'>
                                {author.name}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Read More */}
                    <Button
                      size='icon'
                      className='group-hover:bg-primary! bg-background text-foreground hover:bg-primary! hover:text-primary-foreground group-hover:text-primary-foreground border group-hover:border-transparent hover:border-transparent'
                    >
                      <ArrowRightIcon className='size-4 -rotate-45' />

                      <span className='sr-only'>
                        Read more: {post.title}
                      </span>
                    </Button>

                  </div>

                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog

