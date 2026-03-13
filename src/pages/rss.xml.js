import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts'

export async function GET(context) {
  let posts = []

  try {
    posts = await getCollection('blog')
    const people = await getCollection('people')
    const peopleById = new Map(people.map(person => [person.id, person]))
    const getAuthorId = author => (typeof author === 'string' ? author : author.id)

    const publishedPosts = posts.filter(post => !post.data.featured)

    return rss({
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      site: context.site,
      items: publishedPosts.map(post => {
        const authorId = getAuthorId(post.data.author)

        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.pubDate,
          link: `/blog/${post.id}/`,
          author: peopleById.get(authorId)?.data.name || 'Unknown Author',
          categories: post.data.tags || []
        }
      }),
      customData: `<language>en-us</language>`,
      stylesheet: '/rss-styles.xsl'
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Collection is empty or doesn't exist
    console.log('No blog posts found, generating empty RSS feed')
  }

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: [],
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl'
  })
}
