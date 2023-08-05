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
	app: {
		head: {
			link: [
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
				},
			],
		},
	},
})
