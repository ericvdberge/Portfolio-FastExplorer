// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: ['nuxt-icon', '@nuxthq/ui'],
  css: ['@/assets/styles/global.scss']
})
