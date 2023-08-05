import {SpotifyError} from '@/utils/SpotifyAPI/internal/_responses'
import {requestAccessTokenServer} from '@/utils/SpotifyAPI/SpotifyAuth'

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
	if (event.node.req.method !== 'POST') {
		return new SpotifyError(404)
	}

	const body: {token: string} = await readBody(event)
	if (!body || !body.token) {
		return new SpotifyError(400, 'Bad request - No access token provided')
	}

	const redirect_uri = runtimeConfig.public.REDIRECT_URI
	const client_id = runtimeConfig.public.API_CLIENT_ID
	const client_secret = runtimeConfig.API_CLIENT_SECRET
	const token = body.token

	const r = await requestAccessTokenServer({
		client_id,
		client_secret,
		redirect_uri,
		token,
	})
	return r
})
