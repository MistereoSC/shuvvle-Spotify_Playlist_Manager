import {ServerResponse, ServerError} from '@/utils/Server/ServerResponses'

//#region Functions
export async function getRequest<ResponseType>(
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
			return new ServerResponse(data)
		})
		.catch((err) => {
			return new ServerError(err.status, err.message)
		})
	return response
}

export async function postRequest<ResponseType>(
	access_token: string,
	api_path: string,
	options?: {
		url_query?: Array<{[key: string]: string | number}>
		form_body?: Array<{[key: string]: string | number}>
		json_body?: Object
	}
) {
	if (options && options.form_body && options.json_body) {
		return new ServerError(400, 'Bad request - Cannot parse multiple bodys')
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
			return new ServerResponse(data)
		})
		.catch((err) => {
			return new ServerError(err.status, err.message)
		})
	return response
}

export async function putRequest<ResponseType>(
	access_token: string,
	api_path: string,
	options?: {
		url_query?: Array<{[key: string]: string | number}>
		form_body?: Array<{[key: string]: string | number}>
		json_body?: Object
	}
) {
	if (options && options.form_body && options.json_body) {
		return new ServerError(400, 'Bad request - Cannot parse multiple bodies')
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
			return new ServerResponse(data)
		})
		.catch((err) => {
			return new ServerError(err.status, err.message)
		})
	return response
}

function queryToUrl(query: Array<{[key: string]: string | number}>) {
	let val = '?'
	for (let i = 0; i < query.length; i++) {
		if (i !== 0) val += '&'

		const key = Object.keys(query[i])[0]
		const value = query[i][key]
		val += encodeURIComponent(key) + '=' + encodeURIComponent(value)
	}
	return val
}
function formToBody(form: Array<{[key: string]: string | number}>) {
	let val = ''
	for (let i = 0; i < form.length; i++) {
		if (i !== 0) val += ' '

		const key = Object.keys(form[i])[0]
		const value = form[i][key]
		val += encodeURIComponent(key) + '=' + encodeURIComponent(value)
	}
	return val
}
// #endregion

//#region Interfaces
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

interface IRequestOptions {
	method: 'POST' | 'PUT' | 'GET'
	headers: {
		Authorization: string
	}
	body?: string
}
//#endregion
