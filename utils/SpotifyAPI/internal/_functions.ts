import {SpotifyError, SpotifyResponse} from './_responses'

export async function get<ResponseType>(
	access_token: string,
	api_path: string,
	options?: {
		url_query?: Array<{[key: string]: string | number}>
	}
) {
	let url = `https://api.spotify.com/v1/${api_path}`
	if (options && options.url_query) {
		url += queryToUrl(options.url_query)
	}
	const response = await fetch(url, {
		method: 'GET',
		headers: {Authorization: `Bearer ${access_token}`},
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error('Error: ' + res.status)
			}
			return res.json()
		})
		.then((data: ResponseType) => {
			return new SpotifyResponse(data)
		})
		.catch((err) => {
			return new SpotifyError(err.status, err.message)
		})
	return response
}

export async function post<ResponseType>(
	access_token: string,
	api_path: string,
	options?: {
		url_query?: Array<{[key: string]: string | number}>
		form_body?: Array<{[key: string]: string | number}>
		json_body?: Object
	}
) {
	if (options && options.form_body && options.json_body) {
		return new SpotifyError(400, 'Bad request - Cannot parse multiple bodys')
	}

	let url = `https://api.spotify.com/v1/${api_path}`
	if (options && options.url_query) {
		url += queryToUrl(options.url_query)
	}

	const requestOptions: IRequestOptions = {
		method: 'POST',
		headers: {Authorization: `Bearer ${access_token}`},
	}

	if (options && options.json_body) {
		requestOptions.body = JSON.stringify(options.json_body)
	}
	if (options && options.form_body) {
		requestOptions.body = formToBody(options.form_body)
	}

	const response = await fetch(url, requestOptions)
		.then((res) => {
			if (!res.ok) {
				throw new Error('Error: ' + res.status)
			}
			return res.json()
		})
		.then((data: ResponseType) => {
			return new SpotifyResponse(data)
		})
		.catch((err) => {
			return new SpotifyError(err.status, err.message)
		})
	return response
}

export async function put<ResponseType>(
	access_token: string,
	api_path: string,
	options?: {
		url_query?: Array<{[key: string]: string | number}>
		form_body?: Array<{[key: string]: string | number}>
		json_body?: Object
	}
) {
	if (options && options.form_body && options.json_body) {
		return new SpotifyError(400, 'Bad request - Cannot parse multiple bodies')
	}

	let url = `https://api.spotify.com/v1/${api_path}`
	if (options && options.url_query) {
		url += queryToUrl(options.url_query)
	}
	const requestOptions: IRequestOptions = {
		method: 'PUT',
		headers: {Authorization: `Bearer ${access_token}`},
	}

	if (options && options.json_body) {
		requestOptions.body = JSON.stringify(options.json_body)
	}
	if (options && options.form_body) {
		requestOptions.body = formToBody(options.form_body)
	}

	const response = await fetch(url, requestOptions)
		.then((res) => {
			if (!res.ok) {
				throw new Error('Error: ' + res.status)
			}
			return res.json()
		})
		.then((data: ResponseType) => {
			return new SpotifyResponse(data)
		})
		.catch((err) => {
			return new SpotifyError(err.status, err.message)
		})
	return response
}

export async function del<ResponseType>(
	access_token: string,
	api_path: string,
	options?: {
		url_query?: Array<{[key: string]: string | number}>
		form_body?: Array<{[key: string]: string | number}>
		json_body?: Object
	}
) {
	if (options && options.form_body && options.json_body) {
		return new SpotifyError(400, 'Bad request - Cannot parse multiple bodies')
	}

	let url = `https://api.spotify.com/v1/${api_path}`
	if (options && options.url_query) {
		url += queryToUrl(options.url_query)
	}
	const requestOptions: IRequestOptions = {
		method: 'DELETE',
		headers: {Authorization: `Bearer ${access_token}`},
	}

	if (options && options.json_body) {
		requestOptions.body = JSON.stringify(options.json_body)
	}
	if (options && options.form_body) {
		requestOptions.body = formToBody(options.form_body)
	}

	const response = await fetch(url, requestOptions)
		.then((res) => {
			if (!res.ok) {
				throw new Error('Error: ' + res.status)
			}
			return res.json()
		})
		.then((data: ResponseType) => {
			return new SpotifyResponse(data)
		})
		.catch((err) => {
			return new SpotifyError(err.status, err.message)
		})
	return response
}

function queryToUrl(
	query: Array<{[key: string]: string | number | undefined}>
) {
	let out = '?'
	for (let i = 0; i < query.length; i++) {
		if (i !== 0) out += '&'

		const key = Object.keys(query[i])[0]
		const value = query[i][key]

		if (value !== undefined)
			out += encodeURIComponent(key) + '=' + encodeURIComponent(value)
	}
	return out
}
function objectToBody(options: {[key: string]: string | number | undefined}) {
	let out = '?'
	for (let index = 0; index < Object.keys(options).length; index++) {
		if (index !== 0) out += '&'
		const key = Object.keys(options)[index]
		const value = options[key]
		if (value !== undefined)
			out += encodeURIComponent(key) + '=' + encodeURIComponent(value)
	}
}
function formToBody(form: Array<{[key: string]: string | number | undefined}>) {
	let out = ''
	for (let i = 0; i < form.length; i++) {
		if (i !== 0) out += ' '

		const key = Object.keys(form[i])[0]
		const value = form[i][key]
		if (value !== undefined)
			out += encodeURIComponent(key) + '=' + encodeURIComponent(value)
	}
	return out
}

interface IRequestOptions {
	method: 'POST' | 'PUT' | 'GET' | 'DELETE'
	headers: {
		Authorization: string
	}
	body?: string
}
