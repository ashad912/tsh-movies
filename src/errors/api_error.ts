interface IApiError {
	message: string;
	code: number;
	serializeError: () => { message: string };
}

export class ApiError implements IApiError {
	public message: string;
	public code: number;

	constructor(code: number, message: string) {
		this.message = message;
		this.code = code;
	}

	serializeError() {
		return { message: this.message };
	}

	static badRequest(message: string): ApiError {
		return new ApiError(400, message);
	}

	static notFound(message: string): ApiError {
		return new ApiError(404, message);
	}

	static internal(message: string): ApiError {
		return new ApiError(500, message);
	}
}
