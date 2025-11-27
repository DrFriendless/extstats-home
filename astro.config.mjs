import { defineConfig } from "astro/config";
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx()
    ],
    build: {
        format: "file"
    },
    output: 'static',
    markdown: {
        shikiConfig: {
            theme: 'github-light-default',
        },
    },
    vite: {
        server: {
            proxy: {
                '/api': {
                    target: 'https://extstats.drfriendless.com',
                    changeOrigin: true,
                    secure: false,
                }
            }
        }
    }
});


