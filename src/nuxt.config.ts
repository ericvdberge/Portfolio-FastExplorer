// https://nuxt.com/docs/api/configuration/nuxt-config
const year = 31536000

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: ['nuxt-icon', '@nuxthq/ui'],
  css: ['@/assets/styles/global.scss'],
  nitro: {
    routeRules: {
      "/img/**": { headers: { 'cache-control': `public,max-age=${year},s-maxage=${year}` } },
      "/_nuxt/**": { headers: { 'cache-control': `public,max-age=${year},s-maxage=${year}` } },
    }
  }
})
