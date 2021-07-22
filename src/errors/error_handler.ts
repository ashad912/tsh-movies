import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger/logger';
import { ApiError } from './api_error';

interface IErrorHandler {
	logger: Logger;
	apiError: ApiError;
	ApiErrorClass: typeof ApiError;
}

export function createErrorHandler({ logger, ApiErrorClass }: IErrorHandler) {
	return errorHandler;

	function errorHandler(
		err: Error | ApiError,
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		logger.error('[ERROR HANDLER]', err);

		if (err instanceof ApiErrorClass) {
			return res.status(err.code).json(err.serializeError());
		}

		const internalError = ApiErrorClass.internal('Something went wrong');
		return res.status(internalError.code).json(internalError.serializeError());
	}
}
