import {defineConfig, passthroughImageService} from "astro/config";
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx()
    ],
    build: {
        format: "file"
    },
    image: {
        service: passthroughImageService()
    },
    output: 'static',
    markdown: {
        shikiConfig: {
            theme: 'github-light-default',
        },
    },
    site: "https://extstats.drfriendless.com",
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


