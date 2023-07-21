// https://nuxt.com/docs/api/configuration/nuxt-config
const year = 31536000
const path = require('path')

export default defineNuxtConfig({
  ssr: true,
  devtools: { 
    enabled: true 
  },
  modules: [
    'nuxt-icon', 
    '@nuxthq/ui'
  ],
  css: [
    '@/assets/styles/global.scss'
  ],
  nitro: {
    output: {
      dir: path.join(__dirname, '../artifacts/website'),
      serverDir: path.join(__dirname, '../artifacts/website/server'),
      publicDir: path.join(__dirname, '../artifacts/website/public'),
    },
    routeRules: {
      "/img/**": { headers: { 'cache-control': `public,max-age=${year},s-maxage=${year}` } },
      "/_nuxt/**": { headers: { 'cache-control': `public,max-age=${year},s-maxage=${year}` } }
    }
  },
  modulesDir: [
    "../node_modules",
  ],
})
