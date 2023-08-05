// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: false},
	modules: ['@pinia/nuxt'],
	runtimeConfig: {
		API_CLIENT_SECRET: process.env.SPOTIFY_API_CLIENT_SECRET,
		public: {
			API_CLIENT_ID: process.env.SPOTIFY_API_CLIENT_ID,
			REDIRECT_URI: process.env.REDIRECT_URI,
		},
	},
	css: ['@/assets/styles/global.scss'],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData:
						'@use "@/assets/styles/_colors.scss" as *;@use "@/assets/styles/_variables.scss" as *;',
				},
			},
		},
	},
})
