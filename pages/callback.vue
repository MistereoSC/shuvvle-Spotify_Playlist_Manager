<script lang="ts" setup>
onMounted(async () => {
	const route = useRoute()
	const token = route.query.code
	const error = {message: route.query.error, state: route.query.state}

	if (error.state || error.message || !token) {
		return // TODO: Handle Error
	}

	const data = await $fetch('/api/authorize', {
		method: 'POST',
		body: {token},
	}).catch((err) => {
		console.error(
			'ERR::: Could not fetch Access Token:',
			err.status,
			err.message
		)

		// TODO: Handle Error
	})

	if (!data || !data.ok || !data.body) {
		console.error('ERR::: Could not fetch Access Token:', data)
		return
	}
	const access_token = data.body

	localStorage.setItem('access_token', access_token.access_token)
	localStorage.setItem('refresh_token', access_token.refresh_token)

	navigateTo('/')
})
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
			<div class="content__loader">
				<div />
				<div />
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

	&__loader {
		$size: 8rem;
		display: flex;
		justify-content: center;
		align-items: center;
		height: $size;
		width: $size;

		div {
			position: absolute;
			height: $size;
			width: $size;
			border-radius: 50%;
			border: 6px solid $accent-green;
			opacity: 1;
			position: absolute;

			animation: ripple 1.5s cubic-bezier(0, 0.25, 0.75, 1) infinite;
			&:nth-child(1) {
				animation-delay: 0.3s;
			}
		}
	}
}

@keyframes ripple {
	0% {
		opacity: 0;
		transform: scale(0);
	}
	5% {
		opacity: 1;
	}
	100% {
		opacity: 0;
		transform: scale(1);
	}
}
</style>
