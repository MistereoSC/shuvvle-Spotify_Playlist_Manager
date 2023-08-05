import * as I from './internal/_interfaces'
/*
 * Spotify Playback Responses
 */
export interface ISpotifyPlaybackState {
	device: ISpotifyDevice
	repeat_state: 'off' | 'track' | 'context'
	shuffle_state: boolean
	context: null | I.IContext
	timestamp: number
	progress_ms: number
	is_playing: boolean
	item: ISpotifyTrack | ISpotifyEpisode | null
	currently_playing_type: 'track' | 'episode' | 'unknown'
	actions: ISpotifyPlaybackActions
}
export interface ISpotifyDevice {
	id: string
	is_active: boolean
	is_private_session: boolean
	is_restricted: boolean
	name: string
	type: 'computer' | 'smartphone' | 'speaker' | string
	volume_percent: number
}
export interface ISpotifyTrack {
	album: ISpotifyAlbum
	artists: Array<ISpotifyArtist>
	available_markets: Array<string>
	disc_number: number
	duration_ms: number
	explicit: boolean
	external_ids: I.IExternalIDs
	external_urls: I.IExternalURLs
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
export interface ISpotifyEpisode {
	audio_preview_url: string
	description: string
	html_description: string
	duration_ms: number
	explicit: boolean
	external_urls: I.IExternalURLs
	href: string
	id: string
	images: Array<I.IImage>
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
export interface ISpotifyPlaybackActions {
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
export interface ISpotifyAlbum {
	album_type: 'album' | 'single' | 'compilation'
	total_tracks: number
	available_markets: Array<string>
	external_urls: I.IExternalURLs
	href: string
	id: number
	images: Array<I.IImage>
	name: string
	release_date: string
	release_date_precision: 'year' | 'month' | 'day'
	restrictions: {[key: string]: string}
	type: 'album'
	uri: string
	copyrights: Array<{text: string; type: 'C' | 'P'}>
	external_ids: I.IExternalIDs
	genres: Array<string>
	label: string
	popularity: number
	album_group: 'album' | 'single' | 'compilation' | 'appears_on'
	artists: Array<ISpotifyArtistSimplified>
}
interface ISpotifyArtistSimplified {
	external_urls: I.IExternalURLs
	href: string
	id: string
	name: string
	type: 'artist'
	uri: string
}
export interface ISpotifyArtist extends ISpotifyArtistSimplified {
	followers: {
		href: string
		total: number
	}
	genres: Array<string>
	images: Array<I.IImage>
	popularity: number
}
export interface ISpotifyShow {
	available_markets: Array<string>
	copyrights: Array<{text: string; type: 'C' | 'P'}>
	description: string
	html_description: string
	explicit: boolean
	external_urls: I.IExternalURLs
	href: string
	id: string
	images: Array<I.IImage>
	is_externally_hosted: boolean
	languages: Array<string>
	media_type: string
	name: string
	publisher: string
	type: 'show'
	uri: string
	total_episodes: number
}
export interface ISpotifyRecentlyPlayed {
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
		context: I.IContext
	}
}
export interface ISpotifyQueue {
	currently_playing: null | ISpotifyEpisode | ISpotifyTrack
	queue: Array<ISpotifyEpisode | ISpotifyTrack>
}

/*
 * Spotify Playlist Responses
 */
export interface ISpotifyPlaylist {
	collaborative: false
	description: string
	external_urls: I.IExternalURLs
	followers?: {href: null; total: number}
	href: string
	id: string
	images: Array<I.IImage>
	name: string
	owner: {
		display_name: string
		external_urls: I.IExternalURLs
		href: string
		id: string
		type: 'user'
		uri: string
	}
	public: boolean
	snapshot_id: string
	tracks: ITracksSimple | ISpotifyTrackList
	type: 'playlist'
	uri: string
}

export interface ISpotifyUserPlaylists {
	href: string
	limit: number
	offset: number
	total: number
	next: string | null
	previous: string | null
	items: Array<ISpotifyPlaylist>
}

interface ITracksSimple {
	href: string
	total: number
}
export interface ISpotifyTrackList extends ITracksSimple {
	limit: number
	next: string | null
	offset: number
	previous: string | null
	items: Array<ISpotifyTrackListItem>
}

export interface ISpotifyTrackListItem {
	added_at: string
	added_by: {
		external_urls: I.IExternalURLs
		followers: {
			href: null
			total: number
		}
		href: string
		id: string
		type: 'user'
		uri: string
	}
	is_local: boolean
	track: ISpotifyTrack | ISpotifyEpisode
}
