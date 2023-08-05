<script lang="ts" setup>
import {ISpotifyPlaylist} from '@/utils/SpotifyAPI/SpotifyPlaylists'
import {useSpotifyStore} from '@/utils/stores/spotifyStore'
const props = defineProps<{
	playlists: Array<ISpotifyPlaylist>
}>()

const store = useSpotifyStore()
let Spotify = store.getSpotify()

const storedPlaylists: Array<{playlist_id: string; songs: Array<number>}> = []
function getPlaylistSongs(playlistId: string) {
	const requestedPlaylist = storedPlaylists.find(
		(playlist) => playlist.playlist_id === playlistId
	)
	if (requestedPlaylist) return requestedPlaylist.songs

	const songs = Array.from({length: 5}, () => Math.floor(Math.random() * 40))
	storedPlaylists.push({playlist_id: playlistId, songs})
	return songs
}
</script>

<template>
	<div class="container">
		<div class="playlist" v-for="playlist in playlists.slice(0, 3)">
			<div class="playlist__header">
				{{ playlist.name }}
			</div>
			<div class="playlist__content">
				<div
					class="playlist__song"
					v-for="song in getPlaylistSongs(playlist.id)"
				>
					{{ song }}
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 2rem;
	padding: 1rem;
	width: 100%;
	height: 100%;
}

.playlist {
	background-color: $background-2;
	&__header {
	}
	&__content {
	}
	&__song {
	}
}
</style>
utils/SpotifyAPI/internal/SpotifyPlaylists
