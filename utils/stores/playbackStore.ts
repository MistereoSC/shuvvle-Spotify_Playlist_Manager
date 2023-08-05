import {defineStore} from 'pinia'
import {ISpotifyTrack} from 'utils/SpotifyAPI/SpotifyInterfaces'

export const usePlaybackStore = defineStore('playback', () => {
	const currentSong: Ref<ISpotifyTrack | null> = ref(null)

	function selectSong(song: ISpotifyTrack) {
		currentSong.value = song
	}

	return {currentSong, selectSong}
})
