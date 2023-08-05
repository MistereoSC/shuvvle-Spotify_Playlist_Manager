<script lang="ts" setup>
import {
	requestUserAuthorizationRedirect,
	TScope,
} from '@/utils/SpotifyAPI/SpotifyAuth'

function login() {
	const runtimeConfig = useRuntimeConfig()
	const client_id = runtimeConfig.public.API_CLIENT_ID
	const redirect_uri = runtimeConfig.public.REDIRECT_URI
	const scopes: Array<TScope> = [
		'playlist-modify-private',
		'playlist-modify-public',
		'playlist-read-collaborative',
		'playlist-read-private',
		'streaming',
		'user-read-playback-state',
		'user-modify-playback-state',
		'user-read-currently-playing',
		'user-read-recently-played',
	]
	requestUserAuthorizationRedirect({
		client_id,
		redirect_uri,
		scopes,
	})
}
</script>

<template>
	<div class="view">
		<div class="header">
			<img
				class="header__icon"
				src="/Spotify_Green.png"
				alt="Spotify Brand Logo"
			/>
			<h1 class="header__title">Shuvvle - Spotify Playlist Manager</h1>
		</div>
		<div class="content">
			<div class="content__modal">
				<h2 class="content__modal__title">Log in to your Spotify</h2>
				<button class="content__modal__button" @click="() => login()">
					<img
						class="content__modal__button__image"
						src="/Spotify_Black.png"
						alt="Spotify Brand Logo"
					/>
					<span class="content__modal__button__text">Login with Spotify</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.view {
	height: 100vh;
	display: grid;
	grid-template-rows: auto 1fr;
}
.header {
	height: 64px;
	display: grid;
	place-items: center;
	grid-template-columns: 180px 1fr 180px;

	background-color: $background-1;

	&__title {
		font-weight: 700;
		margin: 0.5rem;
	}
	&__icon {
		height: 48px;
	}
}

.content {
	display: grid;
	place-items: center;
	width: 100%;
	height: 100%;

	&__modal {
		background-color: $background-1;
		padding: 1.5rem;
		border-radius: $border-radius;

		&__title {
			margin-bottom: 1.5rem;
		}
		&__button {
			cursor: pointer;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			gap: 1rem;

			padding: 0 1rem;
			width: 300px;
			height: 64px;
			background-color: $accent-green;
			border-radius: $border-radius;
			border: none;
			box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);

			&__image {
				height: 50%;
			}
			&__text {
				font-weight: 600;
				font-size: 1rem;
			}

			transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
			&:hover {
				transform: translate(-3px, -3px);
				box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.5);
			}
		}
	}
}
</style>
