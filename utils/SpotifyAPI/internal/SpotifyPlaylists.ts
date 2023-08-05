import * as Request from './_functions'
import * as INTERFACES from '../SpotifyInterfaces'

export async function getCurrentUserPlaylists(
	access_token: string,
	options?: {limit?: number; offset?: number}
) {
	// TODO: Implement fetch_all
	const url_query: Array<{[key: string]: string | number}> = []
	if (options?.limit) url_query.push({limit: options.limit})
	if (options?.offset) url_query.push({offset: options.offset})
	const response = await Request.get<INTERFACES.ISpotifyUserPlaylists>(
		access_token,
		'me/playlists',
		url_query ? {url_query} : undefined
	)
	return response
}

export async function getPlaylistTracks(
	access_token: string,
	playlist_id: string,
	options?: {
		limit?: number
		offset?: number
		fetch_all?: boolean
		additional_types?: 'track' | 'episode'
	}
) {
	const url_query: Array<{[key: string]: string | number}> = []
	if (options?.fetch_all) url_query.push({limit: 50})
	if (options?.limit && !options.fetch_all)
		url_query.push({limit: options.limit})
	if (options?.offset) url_query.push({offset: options.offset})
	if (options?.additional_types)
		url_query.push({additional_types: options.additional_types})

	const response = await Request.get<INTERFACES.ISpotifyTrackList>(
		access_token,
		`playlists/${playlist_id}/tracks`,
		url_query ? {url_query} : undefined
	)
	if (!response.ok || !response.body) return response

	if (options?.fetch_all && response.ok) {
		const lim = options.limit ? options.limit : 50
		const off = options.offset ? options.offset : 0
		const totalFetchedTracks = lim + off

		if (totalFetchedTracks < response.body.total) {
			console.log(
				'Fetching Tracks:',
				totalFetchedTracks + ' / ' + response.body.total
			)

			const nextResponse = await getPlaylistTracks(access_token, playlist_id, {
				offset: totalFetchedTracks,
				limit: 50,
				fetch_all: true,
				additional_types: options?.additional_types,
			})

			if (nextResponse.ok && nextResponse.body) {
				response.body.items = response.body.items.concat(
					nextResponse.body.items
				)
			}
		} else {
			console.log(
				'Fetching Tracks:',
				response.body.total + ' / ' + response.body.total
			)
		}
	}

	return response
}

export async function getPlaylist(access_token: string, playlist_id: string) {
	const response = await Request.get<INTERFACES.ISpotifyPlaylist>(
		access_token,
		`playlists/${playlist_id}`
	)
	return response
}

export async function getUserPlaylists(
	access_token: string,
	user_id: string,
	options?: {limit?: number; offset?: number}
) {
	// TODO: Implement fetch_all
	const url_query: Array<{[key: string]: string | number}> = []
	if (options?.limit) url_query.push({limit: options.limit})
	if (options?.offset) url_query.push({offset: options.offset})
	const response = await Request.get<INTERFACES.ISpotifyUserPlaylists>(
		access_token,
		`users/${user_id}/playlists`,
		url_query ? {url_query} : undefined
	)
	return response
}

export async function updatePlaylistDetails(
	access_token: string,
	playlist_id: string,
	body: {
		name: string
		public?: boolean
		collaborative?: boolean
		description?: string
	}
) {
	const response = await Request.put<null>(
		access_token,
		`playlists/${playlist_id}`,
		{json_body: body}
	)
	return response
}

export async function reorderPlaylistItems(
	access_token: string,
	playlist_id: string,
	body: {
		snapshot_id: string
		range_start: number
		range_length: number
		insert_before: number
	}
) {
	const response = await Request.put<{snapshot_id: string}>(
		access_token,
		`playlists/${playlist_id}/tracks`,
		{json_body: body}
	)
	return response
}

export async function replacePlaylistItems(
	access_token: string,
	playlist_id: string,
	body: {
		uris: Array<string>
	}
) {
	const response = await Request.put<{snapshot_id: string}>(
		access_token,
		`playlists/${playlist_id}/tracks`,
		{json_body: body}
	)
	return response
}

export async function addItemsToPlaylist(
	access_token: string,
	playlist_id: string,
	body: {
		uris: Array<string>
		position?: number
	}
) {
	const response = await Request.post<{snapshot_id: string}>(
		access_token,
		`playlists/${playlist_id}/tracks`,
		{json_body: body}
	)
	return response
}

export async function deleteItemsFromPlaylist(
	access_token: string,
	playlist_id: string,
	body: {snapshot_id?: string; tracks: Array<{uri: string}>}
) {
	const response = await Request.del<{snapshot_id: string}>(
		access_token,
		`playlists/${playlist_id}/tracks`,
		{json_body: body}
	)
	return response
}

export async function createPlaylist(
	access_token: string,
	user_id: string,
	body: {
		name: string
		public?: boolean
		collaborative?: boolean
		description?: string
	}
) {
	const response = await Request.post<INTERFACES.ISpotifyPlaylist>(
		access_token,
		`users/${user_id}/playlists`,
		{json_body: body}
	)
	return response
}

export async function getFeaturedPlaylists(
	access_token: string,
	options?: {
		offset?: number
		limit?: number
		locale?: string
		country?: string
		timestamp?: string
	}
) {
	const url_query: Array<{[key: string]: string | number}> = []
	if (options?.limit) url_query.push({limit: options.limit})
	if (options?.offset) url_query.push({offset: options.offset})
	if (options?.locale) url_query.push({locale: options.locale})
	if (options?.country) url_query.push({country: options.country})
	if (options?.timestamp) url_query.push({timestamp: options.timestamp})
	const response = await Request.get<{
		message: string
		playlists: INTERFACES.ISpotifyUserPlaylists
	}>(
		access_token,
		`browse/featured-playlists`,
		url_query ? {url_query} : undefined
	)
	return response
}

export async function getCategoryPlaylists(
	access_token: string,
	category_id: string,
	options?: {
		offset?: number
		limit?: number
		country?: string
	}
) {
	const url_query: Array<{[key: string]: string | number}> = []
	if (options?.limit) url_query.push({limit: options.limit})
	if (options?.offset) url_query.push({offset: options.offset})
	if (options?.country) url_query.push({country: options.country})
	const response = await Request.get<{
		message: string
		playlists: INTERFACES.ISpotifyUserPlaylists
	}>(
		access_token,
		`browse/categories/${category_id}/playlists`,
		url_query ? {url_query} : undefined
	)
	return response
}
