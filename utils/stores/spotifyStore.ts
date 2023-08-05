import {defineStore} from 'pinia'
import {
	SpotifyInstance,
	createSpotifyInstance,
} from '@/utils/SpotifyAPI/Spotify'

export const useSpotifyStore = defineStore('spotify', () => {
	const Instance: Ref<SpotifyInstance | null> = ref(null)

	const getSpotify = () => {
		if (Instance.value == null) {
			try {
				const access_token = localStorage.getItem('access_token')
				const refresh_token = localStorage.getItem('refresh_token')
				if (!access_token || !refresh_token) return null

				Instance.value = createSpotifyInstance(access_token, refresh_token)
				return Instance.value
			} catch {
				return null
			}
		} else {
			return Instance.value
		}
	}

	return {getSpotify}
})
