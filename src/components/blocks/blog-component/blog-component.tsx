'use client'

import { useState } from 'react'

import { ArrowRightIcon, CalendarDaysIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { withBasePath } from '@/lib/paths'
import { sortPostsByPubDate } from '@/utils/blog'

export type BlogPost = {
  id: number
  slug: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  pubDate: string
  authors: Array<{
    name: string
    avatarUrl: string
    url?: string
  }>
  categories: string[]
  featured: boolean
}

interface BlogProps {
  blogData?: BlogPost[]
}

interface BlogGridProps {
  posts: BlogPost[]
  onCategoryClick?: (category: string) => void
  columnsMaxTwo?: boolean
}

export const BlogGrid = ({ posts, onCategoryClick, columnsMaxTwo = false }: BlogGridProps) => {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${columnsMaxTwo ? '' : 'lg:grid-cols-3'}`}>
      {posts.map(post => (
        <Card className='group shadow-none'>
          <a
            href={withBasePath(`/blog/${post.slug}`)}
            key={post.id}
            className='h-full cursor-pointer overflow-hidden shadow-none transition-all duration-300'
            onClick={e => {
              const target = e.target as HTMLElement

              if (onCategoryClick && target.closest('.badge')) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            <CardContent className='space-y-3.5'>
              <div className='mb-6 overflow-hidden rounded-lg sm:mb-12'>
                <img
                  src={withBasePath(post.imageUrl)}
                  alt={post.imageAlt}
                  className='h-59.5 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                  loading='lazy'
                />
              </div>
              <div className='flex items-center justify-between gap-1.5'>
                <div className='text-muted-foreground flex items-center gap-1.5'>
                  <CalendarDaysIcon className='size-5' />
                  <p>{post.pubDate}</p>
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {post.categories.map(category => (
                    <Badge
                      key={category}
                      className='bg-primary/10 text-primary badge hover:border-primary rounded-full border border-transparent text-sm'
                      onClick={
                        onCategoryClick
                          ? e => {
                              e.preventDefault()
                              e.stopPropagation()
                              onCategoryClick(category)
                            }
                          : undefined
                      }
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <h3 className='line-clamp-2 text-lg font-medium md:text-xl'>{post.title}</h3>
              <p className='text-muted-foreground line-clamp-2'>{post.description}</p>
            </CardContent>
          </a>
          <CardContent className='pt-0'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-wrap gap-4'>
                {post.authors &&
                  post.authors.length > 0 &&
                  post.authors.map((author, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      {author.url ? (
                        <a
                          href={withBasePath(author.url)}
                          className='text-foreground text-sm font-medium hover:underline'
                          onClick={e => {
                            e.stopPropagation()
                          }}
                        >
                          {author.name}
                        </a>
                      ) : (
                        <span className='text-foreground text-sm font-medium'>{author.name}</span>
                      )}
                    </div>
                  ))}
              </div>
              <a
                href={withBasePath(`/blog/${post.slug}`)}
                className='group-hover:bg-primary! bg-background text-foreground hover:bg-primary! hover:text-primary-foreground group-hover:text-primary-foreground inline-flex h-10 w-10 items-center justify-center rounded-md border group-hover:border-transparent hover:border-transparent'
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <ArrowRightIcon className='size-4 -rotate-45' />
                <span className='sr-only'>Read more: {post.title}</span>
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const Blog = ({ blogData = [] }: BlogProps) => {
  const [selectedTab, setSelectedTab] = useState('All')

  // Filter out featured posts to avoid duplication with hero section
  // Sort posts by date (newest first), then by id (highest first) when dates match.
  const nonFeaturedPosts = sortPostsByPubDate(blogData.filter(post => !post.featured))

  // Dynamically generate categories from the available data
  const uniqueCategories = [...new Set(nonFeaturedPosts.flatMap(post => post.categories))]
  const categories = ['All', ...uniqueCategories.sort()]

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)

    if (tab === 'All') {
      window.location.href = '#categories'
    }
  }

  return (
    <section className='py-8 sm:pb-16 lg:pb-24' id='categories'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8'>
        {/* Tabs and Search */}
        <Tabs defaultValue='All' value={selectedTab} onValueChange={handleTabChange} className='gap-8 lg:gap-16'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <ScrollArea className='bg-muted w-full rounded-lg sm:w-auto'>
              <TabsList className='h-auto gap-1'>
                {categories.map(category => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    id={`category-${category}`}
                    className='hover:bg-primary/10 cursor-pointer rounded-lg px-4 text-base'
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>

          {/* All Posts Tab */}
          <TabsContent value='All'>
            <BlogGrid posts={nonFeaturedPosts} onCategoryClick={handleTabChange} />
          </TabsContent>

          {/* Category-specific Tabs */}
          {categories.slice(1).map((category, index) => (
            <TabsContent key={index} value={category}>
              <BlogGrid
                posts={nonFeaturedPosts.filter(post => post.categories.includes(category))}
                onCategoryClick={handleTabChange}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default Blog
