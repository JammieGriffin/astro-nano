import {defineConfig} from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import path from 'path'
import vue from '@astrojs/vue'

export default defineConfig({
  site: 'https://astro-nano-demo.vercel.app',
  integrations: [mdx(), sitemap(), tailwind(), vue()],
  vite: {
    resolve: {
      alias: {
        '@*': path.join(process.cwd(),'./src/*')
      }
    }
  }
})
