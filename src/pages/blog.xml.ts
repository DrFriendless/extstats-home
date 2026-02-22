import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { allBlogPosts } from "../code/BlogPost.ts";

export async function GET(context: { site: string }) {
    const blog = allBlogPosts();
    return rss({
        // `<title>` field in output xml
        title: 'Extended Stats Blog',
        // `<description>` field in output xml
        description: 'A blog accompanying the BGG Extended Stats site',
        site: context.site,
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: blog.map((post) => ({
            title: post.title,
            pubDate: post.date(),
            description: post.description,
            // Compute RSS link from post `id`
            // This example assumes all posts are rendered as `/blog/[id]` routes
            link: post.correctUrl(),
            categories: post.tags
        })),
        // (optional) inject custom xml
        customData: `<language>en-au</language>`,
    });
}