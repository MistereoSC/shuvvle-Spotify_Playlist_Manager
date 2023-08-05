import {ISpotifyTrack, ISpotifyEpisode} from '../SpotifyInterfaces'

export interface IImage {
	url: string
	width: number | null
	height: number | null
}
export interface IExternalURLs {
	spotify: string
	[key: string]: string
}
export interface IExternalIDs {
	isrc: string
	ean: string
	upc: string
}
export interface IContext {
	type: string
	href: string
	external_urls: IExternalURLs
	uri: string
}

export interface IStartPlaybackOptions {
	context_uri?: string
	uris?: Array<string>
	position_ms?: number
	offset?: {
		offset: {position: number} | {uri: string}
	}
}
