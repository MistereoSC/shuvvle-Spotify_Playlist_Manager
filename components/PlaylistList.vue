<script lang="ts" setup>
import {ISpotifyPlaylist} from 'utils/SpotifyAPI/SpotifyInterfaces'

const emit = defineEmits<{
	(e: 'select', value: Array<ISpotifyPlaylist>): void
}>()
const props = defineProps<{
	playlists: Array<ISpotifyPlaylist> | undefined
}>()
const selected: Ref<Array<ISpotifyPlaylist>> = ref([])

function togglePlaylist(item: ISpotifyPlaylist) {
	const filtered = selected.value.filter((itm) => itm.id !== item.id)
	if (filtered.length < selected.value.length) {
		selected.value = selected.value.filter((itm) => itm.id !== item.id)
		emit('select', selected.value)
	} else {
		if (selected.value.length < 3) {
			selected.value.push(item)
			emit('select', selected.value)
		}
	}
}
</script>

<template>
	<div class="container">
		<div class="content" v-if="playlists">
			<div
				class="item"
				v-for="(playlist, index) in playlists"
				:key="playlist.id"
				@click="() => togglePlaylist(playlist)"
				:class="{
					active: selected.filter((itm) => itm.id === playlist.id).length > 0,
				}"
			>
				<div class="item__left">
					<img
						class="item__image"
						:src="playlist.images[playlist.images.length - 1].url"
						alt="Playlist Cover"
					/>
				</div>
				<div class="item__center">
					<div class="item__center__top">
						<div class="item__span">
							<span class="item__title">{{ playlist.name }}</span>
						</div>
					</div>
					<div class="item__center__bottom">
						<span class="item__count"
							>{{ playlist.tracks.total }} - &nbsp;</span
						>
						<div class="item__span">
							<span class="item__subtitle">
								{{ playlist.owner.display_name }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="content" v-else>
			<div class="skeleton" v-for="i in 7">
				<div class="skeleton__image" />
				<div class="skeleton__text">
					<div class="skeleton__text__title" />
					<div class="skeleton__text__subtitle" />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.container {
	display: grid;
	grid-template-rows: auto 1fr;
}
.content {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 0.5rem;
}

.item {
	cursor: pointer;
	display: grid;
	grid-template-columns: 60px auto;

	background-color: transparent;
	border-radius: 10px;
	padding-right: 1rem;

	&__title {
		font-weight: 700;
	}
	&__subtitle,
	&__count {
		font-weight: 400;
		color: $text-mute;
	}
	&__span {
		text-overflow: ellipsis;
		width: 25ch;
		white-space: nowrap;
		overflow-x: hidden;
	}
	&__left {
		display: grid;
		place-items: center;
		width: 60px;
		height: 60px;
	}
	&__center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		&__bottom {
			display: flex;
			.item__span {
				width: 20ch;
			}
		}
	}

	&__image {
		width: 45px;
		height: 45px;
		border-radius: 5px;
	}

	transition: background-color 0.2s ease-out;
	&:hover {
		background-color: $background-2;
	}
	&.active {
		background-color: $background-3;
		&:hover {
			background-color: $background-4;
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
