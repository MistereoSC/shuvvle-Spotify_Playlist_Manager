import {getUsersPlaylist} from './internal/SpotifyPlaylists'
import * as Playback from './internal/SpotifyPlayback'

export class SpotifyInstance {
	private access_token: string
	private refresh_token: string
	constructor(access_token: string, refresh_token: string) {
		this.access_token = access_token
		this.refresh_token = refresh_token
		return this
	}

	getAccessToken(): string {
		return this.access_token
	}
	getRefreshToken(): string {
		return this.refresh_token
	}

	Playlists = {
		userPlaylists: (options: {limit?: number; offset?: number}) =>
			getUsersPlaylist(this.access_token, options),
	}
	Playback = {
		pause: () => Playback.pausePlayback(this.access_token),
		resume: (position_ms?: number) =>
			Playback.resumePlayback(this.access_token, position_ms),
		playSong: (options: Playback.IStartPlaybackOptions) =>
			Playback.startPlayback(this.access_token, options),
		next: () => Playback.skipToNext(this.access_token),
		previous: () => Playback.skipToPrevious(this.access_token),
		seek: (position_ms: number) =>
			Playback.seekPosition(this.access_token, position_ms),
		volume: (volume_percent: number) =>
			Playback.setPlaybackVolume(this.access_token, volume_percent),
		getState: () => Playback.getPlaybackState(this.access_token),
		getRecents: (options: {after?: number; before?: number; limit?: number}) =>
			Playback.getRecentlyPlayed(this.access_token, options),
		getQueue: () => Playback.getQueue(this.access_token),
		enqueue: (track_uri: string) =>
			Playback.addToQueue(this.access_token, track_uri),
		repeat: (state: 'track' | 'context' | 'off') =>
			Playback.setRepeatMode(this.access_token, state),
		shuffle: (state: boolean) =>
			Playback.toggleShuffle(this.access_token, state),
		getDevices: () => Playback.getAvailableDevices(this.access_token),
		switchDevices: (device_ids: Array<string>, play?: boolean) =>
			Playback.transferPlayback(this.access_token, device_ids, play),
	}
}

export function createSpotifyInstance(
	access_token: string,
	refresh_token: string
) {
	return new SpotifyInstance(access_token, refresh_token)
}
