import {IExternalURLs, IImage, getRequest} from './_functions'
import {ServerError} from 'utils/Server/ServerResponses'

export async function getUsersPlaylist(
	access_token: string,
	options?: {limit?: number; offset?: number}
) {
	const url_query: Array<{[key: string]: string | number}> = []
	if (options && options.limit) url_query.push({limit: options.limit})
	if (options && options.offset) url_query.push({limit: options.offset})
	const response = await getRequest<ISpotifyPlaylists>(
		access_token,
		'me/playlists',
		url_query ? {url_query} : undefined
	)
	return response
}

export async function getPlaylist(
	access_token: string,
	options?: {limit?: number; offset?: number}
) {
	const url_query: Array<{[key: string]: string | number}> = []
	if (options && options.limit) url_query.push({limit: options.limit})
	if (options && options.offset) url_query.push({limit: options.offset})
	const response = await getRequest<ISpotifyPlaylists>(
		access_token,
		'me/playlists',
		url_query ? {url_query} : undefined
	)
	return response
}

export interface ISpotifyPlaylist {
	collaborative: false
	description: string
	external_urls: IExternalURLs
	href: string
	id: string
	name: string
	images: Array<IImage>
	owner: {
		display_name: string
		external_urls: IExternalURLs
		href: string
		id: string
		type: 'user'
		uri: string
	}
	primary_color: null | any //? type
	public: boolean
	snapshot_id: string
	tracks: {
		href: string
		total: number
	}
	type: 'playlist'
	uri: string
}

export interface ISpotifyPlaylists {
	href: string
	limit: number
	offset: number
	total: number
	next: string | null // URL
	previous: string | null // URL
	items: Array<ISpotifyPlaylist>
}
