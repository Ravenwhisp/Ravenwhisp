import { defineCollection, reference } from 'astro:content'
import { z } from 'zod'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
    pubDate: z.string(),
    author: reference('people').optional(),
    authors: z.array(reference('people')).optional(),
    category: z.string().optional(),
    categories: z.array(z.string()).optional(),
    relatedPosts: z.array(z.string()).optional(),
    visible: z.boolean().default(true),
    featured: z.boolean().default(false)
  })
})

const people = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    avatarTransparentUrl: z.string().optional(),
    avatarFullUrl: z.string().optional(),
    type: z.enum(['team', 'guest']).default('team'),
    bio: z.string().optional(),
    portfolio: z.string().optional(),
    linkedin: z.string().optional()
  })
})

export const collections = { blog, people }
