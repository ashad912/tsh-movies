import { Request, Response, NextFunction } from 'express';

import { ValidationSchema } from './validation_schema';
import { ApiError } from '../errors/api_error';
import { Logger } from '../logger/logger';

interface IValidation {
	validationSchema: ValidationSchema;
	ApiErrorClass: typeof ApiError;
	logger: Logger;
}

export function validator({
	validationSchema,
	ApiErrorClass,
	logger,
}: IValidation) {
	return validate;

	function validate(req: Request, res: Response, next: NextFunction) {
		const { error, value } = validationSchema.validate(req.body);
		if (error) {
			logger.debug('[VALIDATOR] Validation failed');
			throw ApiErrorClass.badRequest(error);
		}

		logger.debug('[VALIDATOR] Validation passed');

		req.body = value;
		next();
	}
}
