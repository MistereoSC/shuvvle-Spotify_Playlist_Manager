<script lang="ts" setup>
import {useSpotifyStore} from '@/utils/stores/spotifyStore'
import {
	ISpotifyPlaylists,
	ISpotifyPlaylist,
} from '@/utils/SpotifyAPI/SpotifyPlaylists'

const store = useSpotifyStore()
let Spotify = store.getSpotify()
const playlists: Ref<ISpotifyPlaylists | null> = ref(null)
onMounted(async () => {
	// TODO: Redirect if no token is present
	const access_token = localStorage.getItem('access_token')
	const refresh_token = localStorage.getItem('refresh_token')
	if (!access_token || !refresh_token) return

	playlists.value = await fetchPlaylists()
})

async function fetchPlaylists() {
	if (!Spotify) return null
	// TODO: Error Handling
	const response = await Spotify.Playlists.userPlaylists({limit: 50})
		.then((res) => {
			if (!res.ok) {
				console.error(
					'err:: Could not fetch Playlists: ',
					res.status,
					res.message
				)
				return null
			}
			return res.body
		})
		.catch((err) => {
			console.error(
				'err:: Could not fetch Playlists: ',
				err.status,
				err.message
			)
			return null
		})
	console.log(response)
	return response
}

const selectedPlaylists: Ref<Array<ISpotifyPlaylist>> = ref([])
function updateSelection(arr: Array<ISpotifyPlaylist>) {
	selectedPlaylists.value = arr
}
</script>

<template>
	<div class="view">
		<div class="view__grid">
			<div class="view__grid__top"></div>
			<div class="view__grid__center">
				<div class="view__grid__center__left">
					<div class="view__grid__center__left__header">
						<h2 class="view__grid__center__left__header__title">Playlists</h2>
						<span class="view__grid__center__left__header__subtitle"
							>Select up to 3</span
						>
					</div>
					<div class="view__grid__center__left__content scrollable">
						<PlaylistList
							:playlists="playlists ? playlists.items : undefined"
							@select="(arr) => updateSelection(arr)"
						/>
					</div>
				</div>
				<div class="view__grid__center__middle">
					<PlaylistDrop :playlists="selectedPlaylists" />
				</div>
				<div class="view__grid__center__right"></div>
			</div>
			<div class="view__grid__bottom">
				<button @click="() => Spotify?.Playback.resume()">Play</button>
				<button @click="() => Spotify?.Playback.pause()">Pause</button>
				<button @click="() => Spotify?.Playback.next()">Next</button>
				<button @click="() => Spotify?.Playback.previous()">Previous</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$content-max-height: calc(100vh - $header-height - $footer-height);
.view {
	width: 100%;
	height: 100vh;
	&__grid {
		display: grid;
		grid-template-rows: auto 1fr auto;

		width: 100%;
		height: 100%;
		&__top {
			height: $header-height;
			width: 100%;
		}
		&__bottom {
			height: $footer-height;
			width: 100%;

			display: flex;
			justify-content: center;
			align-items: center;
			gap: 1rem;

			button {
				cursor: pointer;
				border: none;
				background: $background-2;
				height: 30px;
				padding: 0 1rem;
				min-width: 60px;
				border-radius: 15px;

				&:hover {
					background-color: $background-3;
				}
			}
		}
		&__center {
			display: grid;
			grid-template-columns: auto 1fr auto;
			gap: 8px;

			width: 100%;
			height: 100%;
			max-height: $content-max-height;

			&__left {
				max-height: $content-max-height;
				min-width: 350px;
				padding-right: 8px;
				background-color: $background-1;
				border-radius: 0 10px 10px 0;
				&__header {
					display: inline;
					z-index: 10;
				}
				&__content {
					height: calc(100% - 54px);
					overflow-y: scroll;
				}
			}
			&__right {
				height: 100%;
				max-height: $content-max-height;
				min-width: 100px;
				background-color: $background-1;
				border-radius: 10px 0 0 10px;
			}
			&__middle {
				height: 100%;
				width: 100%;
				background-color: $background-1;
				border-radius: 10px;
			}
		}
	}
}
</style>
utils/SpotifyAPI/internal/SpotifyPlaylists
