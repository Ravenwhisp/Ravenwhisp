import { defineCollection, reference, z } from 'astro:content'
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
    author: reference('people'),
    category: z.string().default('General'),
    readTime: z.number().optional(),
    featured: z.boolean().default(false)
  })
})

const people = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    avatarUrl: z.string(),
    type: z.enum(['team', 'guest']).default('team'),
    bio: z.string()
  })
})

export const collections = { blog, people }
