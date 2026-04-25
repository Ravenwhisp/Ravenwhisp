// Utility functions for blog posts
import type { CollectionEntry } from 'astro:content'

export function sortPostsByPubDate<T extends { pubDate: string; id?: number }>(posts: T[]): T[] {
  return [...posts].sort((left, right) => {
    const leftTime = Date.parse(left.pubDate)
    const rightTime = Date.parse(right.pubDate)

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      const fallbackDateCompare = right.pubDate.localeCompare(left.pubDate)

      if (fallbackDateCompare !== 0) {
        return fallbackDateCompare
      }

      return (right.id ?? Number.NEGATIVE_INFINITY) - (left.id ?? Number.NEGATIVE_INFINITY)
    }

    const dateCompare = rightTime - leftTime

    if (dateCompare !== 0) {
      return dateCompare
    }

    return (right.id ?? Number.NEGATIVE_INFINITY) - (left.id ?? Number.NEGATIVE_INFINITY)
  })
}

/**
 * Get related posts based on category
 */
export function getRelatedPosts(
  posts: CollectionEntry<'blog'>[],
  currentSlug: string,
  currentCategory: string,
  limit: number = 3
): CollectionEntry<'blog'>[] {
  const hasCategory = (post: CollectionEntry<'blog'>, category: string) => {
    if (post.data.categories?.length) {
      return post.data.categories.includes(category)
    }

    return post.data.category === category
  }

  // First try to get posts from same category
  const sameCategoryPosts = posts.filter(post => hasCategory(post, currentCategory) && post.id !== currentSlug)

  // If we have enough posts from same category, use them
  if (sameCategoryPosts.length >= limit) {
    return sameCategoryPosts.slice(0, limit)
  }

  // If not enough posts from same category, fill with other posts
  const otherPosts = posts.filter(post => !hasCategory(post, currentCategory) && post.id !== currentSlug)

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit)
}

/**
 * Get navigation links for previous and next posts
 */
export function getPostNavigation(
  posts: CollectionEntry<'blog'>[],
  currentSlug: string
): { previous: CollectionEntry<'blog'> | null; next: CollectionEntry<'blog'> | null } {
  // Sort posts by pubDate (newest first)
  const sortedPosts = [...posts].sort((a, b) => a.data.id - b.data.id)
  const currentIndex = sortedPosts.findIndex(post => post.id === currentSlug)

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  const previous = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const next = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  return { previous, next }
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
