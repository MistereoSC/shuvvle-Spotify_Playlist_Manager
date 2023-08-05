import {ServerError} from '@/utils/Server/ServerResponses'
import {
	IImage,
	IExternalURLs,
	IExternalIDs,
	IContext,
	getRequest,
	putRequest,
	postRequest,
} from './_functions'

//#region Functions
export async function getPlaybackState(access_token: string) {
	const response = await getRequest<ISpotifyPlaybackState>(
		access_token,
		'me/player'
	)
	return response
}
export async function getAvailableDevices(access_token: string) {
	const response = await getRequest<Array<ISpotifyDevice>>(
		access_token,
		'me/player/devices'
	)
	return response
}
export async function getCurrentlyPlaying(access_token: string) {
	const response = await getRequest<ISpotifyPlaybackState>(
		access_token,
		'me/player/currently-playing'
	)
	return response
}
export async function getRecentlyPlayed(
	access_token: string,
	options: {
		after?: number
		before?: number
		limit?: number
	}
) {
	if (!options.after && !options.before) {
		return new ServerError(
			400,
			'Bad request - either before or after (or both) bust be specified'
		)
	}
	const query: Array<{[key: string]: string | number}> = []
	if (options.before) query.push({before: options.before})
	if (options.after) query.push({after: options.after})
	if (options.limit) query.push({limit: options.limit})
	const response = await getRequest<ISpotifyRecentlyPlayed>(
		access_token,
		'me/player/recently-played',
		{url_query: query}
	)
	return response
}
export async function getQueue(access_token: string) {
	const response = await getRequest<ISpotifyQueue>(
		access_token,
		'me/player/queue'
	)
	return response
}
export async function resumePlayback(
	access_token: string,
	position_ms?: number
) {
	const response = putRequest<null>(
		access_token,
		'me/player/play',
		position_ms ? {json_body: {position_ms}} : undefined
	)
	return response
}
export async function startPlayback(
	access_token: string,
	options: IStartPlaybackOptions
) {
	if (!options.context_uri && !options.uris) {
		return new ServerError(
			400,
			'Bad request - must provide uris or context_uri'
		)
	}
	if (options && options.context_uri && options.offset) {
		return new ServerError(400, 'Bad request - offset requires context_uri')
	}
	let json_body: IStartPlaybackOptions | undefined = undefined
	if (options) {
		json_body = options
	}

	const response = putRequest<null>(
		access_token,
		'me/player/play',
		json_body ? {json_body} : undefined
	)
	return response
}
export async function pausePlayback(access_token: string) {
	const response = putRequest<null>(access_token, 'me/player/pause')
	return response
}
export async function skipToNext(access_token: string) {
	const response = postRequest<null>(access_token, 'me/player/next')
	return response
}
export async function skipToPrevious(access_token: string) {
	const response = postRequest<null>(access_token, 'me/player/previous')
	return response
}
export async function seekPosition(access_token: string, position_ms: number) {
	const response = putRequest<null>(access_token, 'me/player/seek', {
		url_query: [{position_ms}],
	})
	return response
}
export async function setRepeatMode(
	access_token: string,
	state: 'track' | 'context' | 'off'
) {
	const response = putRequest<null>(access_token, 'me/player/repeat', {
		url_query: [{state}],
	})
	return response
}
export async function setPlaybackVolume(
	access_token: string,
	volume_percent: number
) {
	const response = putRequest<null>(access_token, 'me/player/volume', {
		url_query: [{volume_percent}],
	})
	return response
}
export async function toggleShuffle(access_token: string, state: boolean) {
	const response = putRequest<null>(access_token, 'me/player/shuffle', {
		url_query: [{state: state.toString()}],
	})
	return response
}
export async function transferPlayback(
	access_token: string,
	device_ids: Array<string>,
	play?: boolean
) {
	const json_body: {device_ids: Array<string>; play?: boolean} = {device_ids}
	if (play !== undefined) json_body.play = play
	const response = putRequest<null>(access_token, 'me/player', {
		json_body,
	})
	return response
}
export async function addToQueue(access_token: string, track_uri: string) {
	const response = postRequest<null>(access_token, 'me/player/queue', {
		url_query: [{uri: track_uri}],
	})
	return response
}
// #endregion

//#region Interfaces
interface ISpotifyPlaybackState {
	device: ISpotifyDevice
	repeat_state: 'off' | 'track' | 'context'
	shuffle_state: boolean
	context: null | IContext
	timestamp: number
	progress_ms: number
	is_playing: boolean
	item: ISpotifyTrack | ISpotifyEpisode | null
	currently_playing_type: 'track' | 'episode' | 'unknown'
	actions: ISpotifyPlaybackActions
}
interface ISpotifyDevice {
	id: string
	is_active: boolean
	is_private_session: boolean
	is_restricted: boolean
	name: string
	type: 'computer' | 'smartphone' | 'speaker' | string
	volume_percent: number
}
interface ISpotifyTrack {
	album: ISpotifyAlbum
	artists: Array<ISpotifyArtist>
	available_markets: Array<string>
	disc_number: number
	duration_ms: number
	explicit: boolean
	external_ids: IExternalIDs
	external_urls: IExternalURLs
	href: string
	id: string
	is_playable: boolean
	linked_from?: ISpotifyTrack
	restrictions: {[key: string]: string}
	name: string
	popularity: string
	preview_url: string
	track_number: number
	type: 'track'
	uri: string
	is_local: boolean
}
interface ISpotifyEpisode {
	audio_preview_url: string
	description: string
	html_description: string
	duration_ms: number
	explicit: boolean
	external_urls: IExternalURLs
	href: string
	id: string
	images: Array<IImage>
	is_externally_hosted: boolean
	is_playable: boolean
	languages: Array<string>
	name: string
	release_date: string
	release_date_precision: 'year' | 'month' | 'day'
	resume_point: {
		fully_played: boolean
		resume_point_ms: number
	}
	type: 'episode'
	uri: string
	restrictions: {[key: string]: string}
	show: ISpotifyShow
}
interface ISpotifyPlaybackActions {
	interrupting_playback?: boolean
	pausing?: boolean
	resuming?: boolean
	seeking?: boolean
	skipping_next?: boolean
	skipping_prev?: boolean
	toggling_repeat_context?: boolean
	toggling_shuffle?: boolean
	toggling_repeat_track?: boolean
	transferring_playback?: boolean
}
interface ISpotifyAlbum {
	album_type: 'album' | 'single' | 'compilation'
	total_tracks: number
	available_markets: Array<string>
	external_urls: IExternalURLs
	href: string
	id: number
	images: Array<IImage>
	name: string
	release_date: string
	release_date_precision: 'year' | 'month' | 'day'
	restrictions: {[key: string]: string}
	type: 'album'
	uri: string
	copyrights: Array<{text: string; type: 'C' | 'P'}>
	external_ids: IExternalIDs
	genres: Array<string>
	label: string
	popularity: number
	album_group: 'album' | 'single' | 'compilation' | 'appears_on'
	artists: Array<ISpotifyArtistSimplified>
}
interface ISpotifyArtistSimplified {
	external_urls: IExternalURLs
	href: string
	id: string
	name: string
	type: 'artist'
	uri: string
}
interface ISpotifyArtist extends ISpotifyArtistSimplified {
	followers: {
		href: string
		total: number
	}
	genres: Array<string>
	images: Array<IImage>
	popularity: number
}
interface ISpotifyShow {
	available_markets: Array<string>
	copyrights: Array<{text: string; type: 'C' | 'P'}>
	description: string
	html_description: string
	explicit: boolean
	external_urls: IExternalURLs
	href: string
	id: string
	images: Array<IImage>
	is_externally_hosted: boolean
	languages: Array<string>
	media_type: string
	name: string
	publisher: string
	type: 'show'
	uri: string
	total_episodes: number
}
interface ISpotifyRecentlyPlayed {
	href: string
	limit: number
	next: string
	cursors: {
		after: string
		before: string
	}
	total: number
	items: {
		track: ISpotifyTrack
		played_at: string
		context: IContext
	}
}
interface ISpotifyQueue {
	currently_playing: null | ISpotifyEpisode | ISpotifyTrack
	queue: Array<ISpotifyEpisode | ISpotifyTrack>
}

export interface IStartPlaybackOptions {
	context_uri?: string
	uris?: Array<string>
	position_ms?: number
	offset?: {
		offset: {position: number} | {uri: string}
	}
}
//#endregion
