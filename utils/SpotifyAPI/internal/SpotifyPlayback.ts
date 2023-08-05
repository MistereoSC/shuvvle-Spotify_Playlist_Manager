import {SpotifyError} from './_responses'
import {IStartPlaybackOptions} from './_interfaces'
import * as Request from './_functions'
import * as INTERFACES from '../SpotifyInterfaces'

export async function getPlaybackState(access_token: string) {
	const response = await Request.get<INTERFACES.ISpotifyPlaybackState>(
		access_token,
		'me/player'
	)
	return response
}
export async function getAvailableDevices(access_token: string) {
	const response = await Request.get<Array<INTERFACES.ISpotifyDevice>>(
		access_token,
		'me/player/devices'
	)
	return response
}
export async function getCurrentlyPlaying(access_token: string) {
	const response = await Request.get<INTERFACES.ISpotifyPlaybackState>(
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
		return new SpotifyError(
			400,
			'Bad request - either before or after (or both) bust be specified'
		)
	}
	const query: Array<{[key: string]: string | number}> = []
	if (options.before) query.push({before: options.before})
	if (options.after) query.push({after: options.after})
	if (options.limit) query.push({limit: options.limit})
	const response = await Request.get<INTERFACES.ISpotifyRecentlyPlayed>(
		access_token,
		'me/player/recently-played',
		{url_query: query}
	)
	return response
}
export async function getQueue(access_token: string) {
	const response = await Request.get<INTERFACES.ISpotifyQueue>(
		access_token,
		'me/player/queue'
	)
	return response
}
export async function resumePlayback(
	access_token: string,
	position_ms?: number
) {
	const response = Request.put<null>(
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
		return new SpotifyError(
			400,
			'Bad request - must provide uris or context_uri'
		)
	}
	if (options && options.context_uri && options.offset) {
		return new SpotifyError(400, 'Bad request - offset requires context_uri')
	}
	let json_body: IStartPlaybackOptions | undefined = undefined
	if (options) {
		json_body = options
	}

	const response = Request.put<null>(
		access_token,
		'me/player/play',
		json_body ? {json_body} : undefined
	)
	return response
}
export async function pausePlayback(access_token: string) {
	const response = Request.put<null>(access_token, 'me/player/pause')
	return response
}
export async function skipToNext(access_token: string) {
	const response = Request.post<null>(access_token, 'me/player/next')
	return response
}
export async function skipToPrevious(access_token: string) {
	const response = Request.post<null>(access_token, 'me/player/previous')
	return response
}
export async function seekPosition(access_token: string, position_ms: number) {
	const response = Request.put<null>(access_token, 'me/player/seek', {
		url_query: [{position_ms}],
	})
	return response
}
export async function setRepeatMode(
	access_token: string,
	state: 'track' | 'context' | 'off'
) {
	const response = Request.put<null>(access_token, 'me/player/repeat', {
		url_query: [{state}],
	})
	return response
}
export async function setPlaybackVolume(
	access_token: string,
	volume_percent: number
) {
	const response = Request.put<null>(access_token, 'me/player/volume', {
		url_query: [{volume_percent}],
	})
	return response
}
export async function toggleShuffle(access_token: string, state: boolean) {
	const response = Request.put<null>(access_token, 'me/player/shuffle', {
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
	const response = Request.put<null>(access_token, 'me/player', {
		json_body,
	})
	return response
}
export async function addToQueue(access_token: string, track_uri: string) {
	const response = Request.post<null>(access_token, 'me/player/queue', {
		url_query: [{uri: track_uri}],
	})
	return response
}
