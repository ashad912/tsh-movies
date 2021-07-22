import { Request, Response, NextFunction, Router } from 'express';

import { ApiError } from '../errors/api_error';

export type ExpressHandler<T> = (req: Request, res: Response) => T;
export type ExpressMiddleware<T> = ExpressHandler<T> extends (
	...a: any[]
) => infer R
	? (...a: [...U: Parameters<ExpressHandler<void>>, next: NextFunction]) => R
	: never;

export type ExpressErrorHandler<T> = (
	err: Error | ApiError,
	req: Request,
	res: Response,
	next: NextFunction,
) => T;

export type ExpressRouter = Router;
