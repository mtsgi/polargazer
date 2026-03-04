// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@nuxt/fonts'],
  ssr: false,
  app: {
    head: {
      title: 'Polargazer',
      meta: [
        { name: 'description', content: 'Polargazer' },
        { property: 'og:title', content: 'Polargazer' },
        { property: 'og:description', content: 'Polargazer' },
      ],
    },
  },
  css: ['~/assets/css/main.scss'],
  fonts: {
    defaults: {
      weights: [400, 900],
    }
  }
})
