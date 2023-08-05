<script lang="ts" setup>
import {
	ISpotifyPlaylist,
	ISpotifyTrack,
	ISpotifyTrackListItem,
} from '@/utils/SpotifyAPI/SpotifyInterfaces'
import {useSpotifyStore} from '@/utils/stores/spotifyStore'
import {usePlaybackStore} from '@/utils/stores/playbackStore'
const props = defineProps<{
	playlists: Array<ISpotifyPlaylist>
}>()

const storeSpotify = useSpotifyStore()
const Playback = usePlaybackStore()
let Spotify = storeSpotify.getSpotify()
//#region Handle Fetching Playlist Tracks
watch(
	() => props.playlists,
	async (newVal) => {
		if (newVal.length > lastLength.value) {
			await getPlaylistSongs(
				newVal[newVal.length - 1].id,
				props.playlists.length - 1
			)
		}
		lastLength.value = newVal.length
	},
	{deep: true}
)

const storedPlaylists: Ref<
	Array<{
		playlist_id: string
		songs: Array<explicitlyTrack>
		playlist: ISpotifyPlaylist
		color: number
	}>
> = ref([])
const lastLength = ref(0)
async function getPlaylistSongs(playlistId: string, playlistIdx: number) {
	const requestedPlaylist = storedPlaylists.value.find(
		(playlist) => playlist.playlist_id === playlistId
	)
	if (requestedPlaylist) return requestedPlaylist.songs

	const songs = await Spotify!.Playlist.tracks(playlistId, {
		fetch_all: true,
		additional_types: 'track',
	})

	if (!songs.ok || !songs.body) return null
	storedPlaylists.value.push({
		playlist_id: playlistId,
		//@ts-ignore
		songs: songs.body.items,
		playlist: props.playlists[playlistIdx],
		color: Math.floor(Math.random() * 7),
	})
	return songs.body.items
}

interface explicitlyTrack extends ISpotifyTrackListItem {
	track: ISpotifyTrack
}
// #endregion

//#region Drag and Drop
function onDrop(e: DragEvent, toListId: string) {
	if (!e || !e.dataTransfer) return
	const fromListId = e.dataTransfer.getData('fromListId')
	const songIdx = Number(e.dataTransfer.getData('songIdx'))
	const mode = e.dataTransfer.getData('mode')
	if (fromListId == toListId) return

	const fromList = storedPlaylists.value.find(
		(el) => el.playlist_id == fromListId
	)
	const toList = storedPlaylists.value.find((el) => el.playlist_id == toListId)
	if (!toList || !fromList) return

	const song = fromList.songs[songIdx]

	toList.songs.push(song)
	Spotify?.Playlist.add(toList.playlist_id, {
		uris: [song.track.uri],
		position: fromList.songs.length,
	})
	if (mode == 'move') {
		fromList.songs.splice(songIdx, 1)
		Spotify?.Playlist.remove(fromList.playlist_id, {
			tracks: [{uri: song.track.uri}],
		})
	}
}
function onDrag(e: DragEvent, fromListId: string, songIdx: number) {
	if (!e || !e.dataTransfer) return
	const mode: 'copy' | 'move' = e.shiftKey ? 'copy' : 'move'
	e.dataTransfer.dropEffect = mode
	e.dataTransfer.effectAllowed = mode
	e.dataTransfer.setData('mode', mode)
	e.dataTransfer.setData('songIdx', songIdx.toString())
	e.dataTransfer.setData('fromListId', fromListId.toString())
}
//#endregion

//#region Playback
function playPreview(listId: string, songIdx: number) {
	const tracks = storedPlaylists.value.find((el) => el.playlist_id == listId)
	const song = tracks?.songs[songIdx]
	if (!song || !song.track.preview_url) return

	Playback.selectSong(song.track)
}
//#endregion
</script>

<template>
	<div class="container">
		<div
			class="playlist scrollable"
			v-for="(playlist, playlistIndex) in playlists.slice(0, 3)"
			:class="
				'color_' +
				storedPlaylists.find((itm) => itm.playlist_id === playlist.id)?.color
			"
			@drop="(e) => onDrop(e, playlist.id)"
			@dragover.prevent
			@dragenter.prevent
		>
			<div class="playlist__header">
				<span class="playlist__header__icon material-symbols-outlined">
					circle
				</span>
				<span class="playlist__header__title">{{ playlist.name }}</span>
				<span class="playlist__header__total">{{
					storedPlaylists.find((itm) => itm.playlist_id === playlist.id)?.songs
						.length
				}}</span>
			</div>
			<div
				class="playlist__content"
				v-if="
					storedPlaylists.find((itm) => itm.playlist_id === playlist.id)?.songs
				"
			>
				<div
					class="playlist__song"
					v-for="(song, songIndex) in storedPlaylists.find(
						(itm) => itm.playlist_id === playlist.id
					)?.songs"
					draggable="true"
					@dragstart="(e) => onDrag(e, playlist.id, songIndex)"
				>
					<div class="playlist__song__draggable">
						<span class="material-symbols-outlined"> drag_indicator </span>
					</div>
					<div class="playlist__song__left">
						<img
							class="playlist__song__left__image"
							:src="
								song.track.album.images[song.track.album.images.length - 1].url
							"
							alt="Song Cover"
						/>
					</div>
					<div class="playlist__song__center">
						<span class="playlist__song__center__title">{{
							song.track.name
						}}</span>
						<div class="playlist__song__center__artists">
							<span
								class="playlist__song__center__artists__link"
								v-for="artist in song.track.artists"
							>
								{{ artist.name }}
							</span>
						</div>
					</div>
					<div class="playlist__song__right">
						<button
							class="playlist__song__right__button"
							:class="{disabled: !song.track.preview_url}"
							@click="playPreview(playlist.id, songIndex)"
						>
							<span class="material-symbols-outlined"> sound_sampler </span>
						</button>
					</div>
				</div>
			</div>
			<div v-else class="playlist__content">
				<div class="skeleton" v-for="i in 7">
					<div class="skeleton__image" />
					<div class="skeleton__text">
						<div class="skeleton__text__title" />
						<div class="skeleton__text__subtitle" />
					</div>
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
	border-radius: 10px;
	&__header {
		pointer-events: none;
		user-select: none;
		padding: 0.5rem 1rem;
		font-size: 1.5rem;
		font-weight: 800;
		border-bottom: 1px solid $background-3;

		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.5rem;
		align-items: center;

		&__title {
			overflow-x: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		&__total {
			font-size: 0.6em;
			color: $text-mute;
		}
		&__icon {
			font-size: 1rem;
		}
	}
	overflow-y: scroll;
	&__content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		padding: 1rem;
	}
	&__song {
		cursor: grab;
		background-color: $background-3;
		display: grid;
		grid-template-columns: 16px 40px auto 32px;
		&:hover {
			background-color: $background-4;
		}

		border-radius: 5px;
		&__left {
			pointer-events: none;
			display: grid;
			place-items: center;
			width: 40px;
			height: 40px;

			&__image {
				width: 32px;
				height: 32px;
				border-radius: 5px;
			}
		}
		&__center {
			pointer-events: none;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;

			overflow-x: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			&__title {
				font-size: 1rem;
				overflow-x: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			&__artists {
				overflow-x: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: $text-mute;
				font-size: 0.8rem;

				&__link {
					overflow-x: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: $text-mute;

					text-decoration: none;
					&::after {
						content: ',';
						color: $text-mute;
						margin: 0 6px 0 3px;
					}
					&:last-of-type {
						&::after {
							content: '';
						}
					}
					// &:hover {
					// 	text-decoration: underline;
					// 	color: $text;
					// }
				}
			}
		}
		&__right {
			&__button {
				display: grid;
				place-items: center;
				width: 100%;
				height: 100%;
				cursor: pointer !important;
				background-color: transparent;
				border: none;

				&.disabled {
					cursor: default !important;
					span {
						cursor: default !important;
					}
				}
			}
			span {
				cursor: pointer !important;
				color: transparent;
				transition: color 0.2s ease-out;
			}
			&:hover {
				span {
					color: $accent-green-light;
				}
				&.disabled {
					span {
						color: $text-disabled !important;
					}
				}
			}
		}
		&__draggable {
			pointer-events: none;
			display: grid;
			place-items: center;
			span {
				color: $text-disabled;
				font-size: 1.25rem;
			}
		}
	}
}

.playlist__song {
	&:hover {
		.playlist__song__right__button {
			span {
				color: $accent-green;
			}

			&.disabled {
				span {
					color: $text-disabled !important;
				}
			}
		}
	}
}

.playlist {
	&.color_7,
	&.color_0 {
		&::-webkit-scrollbar-thumb {
			border: none;
			background-color: $accent-green;
		}
		.playlist__header__icon {
			color: $accent-green;
		}
	}
	&.color_1 {
		&::-webkit-scrollbar-thumb {
			border: none;
			background-color: $accent-purple;
		}
		.playlist__header__icon {
			color: $accent-purple;
		}
	}
	&.color_2 {
		&::-webkit-scrollbar-thumb {
			border: none;
			background-color: $accent-magenta;
		}
		.playlist__header__icon {
			color: $accent-magenta;
		}
	}
	&.color_3 {
		&::-webkit-scrollbar-thumb {
			border: none;
			background-color: $accent-pink;
		}
		.playlist__header__icon {
			color: $accent-pink;
		}
	}
	&.color_4 {
		&::-webkit-scrollbar-thumb {
			border: none;
			background-color: $accent-yellow;
		}
		.playlist__header__icon {
			color: $accent-yellow;
		}
	}
	&.color_5 {
		&::-webkit-scrollbar-thumb {
			border: none;
			background-color: $accent-orange;
		}
		.playlist__header__icon {
			color: $accent-orange;
		}
	}
	&.color_6 {
		&::-webkit-scrollbar-thumb {
			border: none;
			background-color: $accent-lime;
		}
		.playlist__header__icon {
			color: $accent-lime;
		}
	}
}
.skeleton {
	display: grid;
	grid-template-columns: 60px auto;
	margin: 6px;

	&__image {
		width: 45px;
		height: 45px;
		border-radius: 5px;
	}
	&__text {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		gap: 4px;
		&__title {
			height: 16px;
			border-radius: 8px;
			width: 100%;
			animation-delay: 1s;
		}
		&__subtitle {
			height: 12px;
			border-radius: 6px;
			width: 75%;
			animation-delay: 1s;
		}
	}

	&__image,
	&__text__title,
	&__text__subtitle {
		overflow: hidden;
		background-color: $background-3;
		&::after {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			transform: translateX(-100%);
			background-image: linear-gradient(
				90deg,
				rgba(#fff, 0) 0,
				rgba(#fff, 0.1) 20%,
				rgba(#fff, 0.2) 60%,
				rgba(#fff, 0)
			);
			animation: shimmer 2s infinite;
			content: '';
		}
	}
	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		70% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
}
</style>
