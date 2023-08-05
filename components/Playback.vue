<script lang="ts" setup>
import {usePlaybackStore} from '@/utils/stores/playbackStore'
import {ISpotifyTrack} from 'utils/SpotifyAPI/SpotifyInterfaces'
import {onMounted} from 'vue'
onMounted(() => {
	return
})

const Playback = usePlaybackStore()
const song: Ref<ISpotifyTrack | null> = ref(null)
const unsubscribe = Playback.$subscribe((mutation, state) => {
	song.value = state.currentSong
})
</script>

<template>
	<div class="container">
		<div class="info">
			<div class="info__left">
				<img
					v-if="song && song.album.images.length > 0"
					class="info__left__image"
					:src="song?.album.images[song.album.images.length - 1].url"
					alt="Song Cover"
				/>
				<div class="skeleton__image" v-else></div>
			</div>
			<div class="info__right" v-if="song">
				<span class="info__right__title">{{ song.name }}</span>
				<span class="info__right__artists">
					{{ song.artists[0].name }}
				</span>
			</div>
			<div class="info__right" v-else>
				<div class="skeleton__info"></div>
				<div class="skeleton__info"></div>
			</div>
		</div>
		<div class="playback">
			<audio controls autoplay :src="song?.preview_url"></audio>
		</div>
		<div class="controls"></div>
	</div>
</template>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100%;

	display: grid;
	grid-template-columns: 25% 50% 25%;
}

.info {
	display: flex;
	align-items: center;
	width: 100%;
	margin: 0 1rem;

	&__left {
		width: 60px;
		height: 60px;
		&__image {
			width: 60px;
			height: 60px;
			border-radius: 10px;
		}
	}
	&__right {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 30ch;
		height: 60px;

		justify-content: space-evenly;
		margin-left: 1rem;

		white-space: nowrap;

		&__title {
			overflow-x: hidden;
			text-overflow: ellipsis;

			font-weight: 700;
		}
		&__artists {
			color: $text-mute;
		}
	}
}
.playback {
	display: grid;
	place-items: center;
}
.controls {
}

.skeleton {
	&__image {
		width: 60px;
		height: 60px;
		background-color: $background-3;
		border-radius: 10px;
	}

	&__info {
		background-color: $background-3;

		height: 20px;
		border-radius: 10px;
		width: 80%;
		&:last-child {
			width: 70%;
		}
	}
}
</style>
