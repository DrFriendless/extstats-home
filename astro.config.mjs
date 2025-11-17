import { defineConfig } from "astro/config";
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx()
    ],
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


