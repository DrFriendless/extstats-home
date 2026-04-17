import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/blog" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        author: z.string(),
        tags: z.array(z.string())
    })
});
const doco = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/doco" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string())
    })
});

export const collections = { blog, doco };