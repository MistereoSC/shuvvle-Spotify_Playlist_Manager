import {ServerResponse, ServerError} from '@/utils/Server/ServerResponses'

export function requestUserAuthorizationRedirect(settings: {
	client_id: string
	redirect_uri: string
	scopes: Array<TScope>
}) {
	const api_scopes = settings.scopes.join('%20')
	let auth_url = `https://accounts.spotify.com/authorize?client_id=${settings.client_id}&response_type=code&redirect_uri=${settings.redirect_uri}&scope=${api_scopes}`
	window.location.href = auth_url
}

export async function requestAccessTokenServer(settings: {
	client_id: string
	client_secret: string
	redirect_uri: string
	token: string
}) {
	const url = 'https://accounts.spotify.com/api/token'

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization:
				'Basic ' + btoa(settings.client_id + ':' + settings.client_secret),
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `grant_type=authorization_code&code=${settings.token}&redirect_uri=${settings.redirect_uri}`,
	})
		.then(function (response) {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error('Error: ' + response.status)
			}
		})
		.then(function (data: IAccessToken) {
			return new ServerResponse(data)
		})
		.catch(function (error: {message: string; status: number}) {
			return new ServerError(error.status, error.message)
		})

	return response
}

//#region TYPES
export interface IAccessToken {
	access_token: string
	token_type: 'Bearer'
	scope: string
	expires_in: number
	refresh_token: string
}

export type TScope =
	// Images
	| 'ugc-image-upload'
	// Spotify Connect
	| 'user-read-playback-state'
	| 'user-modify-playback-state'
	| 'user-read-currently-playing'
	// Playback
	| 'app-remote-control'
	| 'streaming'
	// Playlists
	| 'playlist-read-private'
	| 'playlist-read-collaborative'
	| 'playlist-modify-private'
	| 'playlist-modify-public'
	// Follow
	| 'user-follow-modify'
	| 'user-follow-read'
	// Listening History
	| 'user-read-playback-position'
	| 'user-top-read'
	| 'user-read-recently-played'
	// Library
	| 'user-library-modify'
	| 'user-library-read'
	// Users
	| 'user-read-email'
	| 'user-read-private'
	// Open Access
	| 'user-soa-link'
	| 'user-soa-unlink'
	| 'user-manage-entitlements'
	| 'user-manage-partner'
	| 'user-create-partner'
//#endregion
