import {IStartPlaybackOptions} from './internal/_interfaces'
import * as Playlist from './internal/SpotifyPlaylists'
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

	Playlist = {
		tracks: (
			playlist_id: string,
			options?: {
				limit?: number
				offset?: number
				fetch_all?: boolean
				additional_types?: 'track' | 'episode'
			}
		) => Playlist.getPlaylistTracks(this.access_token, playlist_id, options),
		get: (playlist_id: string) =>
			Playlist.getPlaylist(this.access_token, playlist_id),
		update: (
			playlist_id: string,
			body: {
				name: string
				public?: boolean
				collaborative?: boolean
				description?: string
			}
		) => Playlist.updatePlaylistDetails(this.access_token, playlist_id, body),
		reorder: (
			playlist_id: string,
			body: {
				snapshot_id: string
				range_start: number
				range_length: number
				insert_before: number
			}
		) => Playlist.reorderPlaylistItems(this.access_token, playlist_id, body),
		replace: (playlist_id: string, body: {uris: Array<string>}) =>
			Playlist.replacePlaylistItems(this.access_token, playlist_id, body),
		add: (
			playlist_id: string,
			body: {uris: Array<string>; position?: number}
		) => Playlist.addItemsToPlaylist(this.access_token, playlist_id, body),
		remove: (
			playlist_id: string,
			body: {snapshot_id?: string; tracks: Array<{uri: string}>}
		) => Playlist.deleteItemsFromPlaylist(this.access_token, playlist_id, body),
		create: (
			user_id: string,
			body: {
				name: string
				public?: boolean
				collaborative?: boolean
				description?: string
			}
		) => Playlist.createPlaylist(this.access_token, user_id, body),
	}

	Playlists = {
		byCurrentUser: (options: {limit?: number; offset?: number}) =>
			Playlist.getCurrentUserPlaylists(this.access_token, options),
		byUser: (user_id: string, options?: {limit?: number; offset?: number}) =>
			Playlist.getUserPlaylists(this.access_token, user_id, options),
		featured: (options: {
			offset?: number
			limit?: number
			locale?: string
			country?: string
			timestamp?: string
		}) => Playlist.getFeaturedPlaylists(this.access_token, options),
		category: (
			category_id: string,
			options?: {
				offset?: number
				limit?: number
				country?: string
			}
		) => Playlist.getCategoryPlaylists(this.access_token, category_id, options),
	}

	Playback = {
		pause: () => Playback.pausePlayback(this.access_token),
		resume: (position_ms?: number) =>
			Playback.resumePlayback(this.access_token, position_ms),
		playSong: (options: IStartPlaybackOptions) =>
			Playback.startPlayback(this.access_token, options),
		next: () => Playback.skipToNext(this.access_token),
		previous: () => Playback.skipToPrevious(this.access_token),
		seek: (position_ms: number) =>
			Playback.seekPosition(this.access_token, position_ms),
		volume: (volume_percent: number) =>
			Playback.setPlaybackVolume(this.access_token, volume_percent),
		getState: () => Playback.getPlaybackState(this.access_token),
		getRecently: (options: {after?: number; before?: number; limit?: number}) =>
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
