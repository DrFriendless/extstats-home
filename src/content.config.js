import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {milieuLoader} from "./code/JSONLoader";

const blog = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/pages/blog" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        author: z.string(),
        tags: z.array(z.string())
    })
});
const doco = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/pages/doco" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string())
    })
});
export const adventures = defineCollection({
    loader: milieuLoader("./src/pages/adventures/*.json" ),
    schema: z.object({})
});

export const collections = { blog, doco, adventures };