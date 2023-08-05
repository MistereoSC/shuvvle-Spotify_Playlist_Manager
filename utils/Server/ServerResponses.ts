export class ServerError implements IResponse {
	ok = false
	status = 500
	message = ''
	body = null

	constructor(status: number, message?: string) {
		this.status = status
		if (message) {
			this.message = message
		} else {
			getDefaultMessage(status)
		}

		function getDefaultMessage(status: number): string {
			switch (status) {
				case 400:
					return 'Bad request'
				case 401:
					return 'Unauthorized'
				case 404:
					return 'Not found'
				case 405:
					return 'Method not allowed'
				default:
					return 'No Error Message Specified'
			}
		}
	}
}

export class ServerResponse<Type> implements IResponse {
	ok = true
	status = 200
	message = 'ok'
	body: Type

	constructor(body: Type) {
		this.body = body
	}
}

export interface IResponse {
	ok: boolean
	status: number
	body: any
	message: string
}
