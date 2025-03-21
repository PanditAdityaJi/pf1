import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config.ts';
import { sortItemsByDateDesc } from '../utils/data-utils.ts';

export async function GET(context) {
  // Fetch all blog posts and sort them by date in descending order
  const posts = (await getCollection('blog')).sort(sortItemsByDateDesc);
  
  // Ensure the description is always defined with a fallback
  const siteDescription = siteConfig.description || "Latest articles and updates from our blog";
  
  // Generate the RSS feed with all required fields
  return rss({
    // Required RSS feed metadata
    title: siteConfig.title,
    description: siteDescription,
    site: context.site,
    
    // Format each blog post for the RSS feed
    items: posts.map((item) => ({
      title: item.data.title,
      description: item.data.excerpt,
      link: `/blog/${item.id}/`,
      pubDate: item.data.publishDate.setUTCHours(0)
    }))
  });
}
