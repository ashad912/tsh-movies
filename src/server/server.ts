import http from 'http';

import express from 'express';

import { ExpressRouter, ExpressErrorHandler } from './express.type';
import { Server, ServerDone } from './server.type';

import { Logger } from '../logger/logger';
import { ApiError } from '../errors/api_error';

export interface ICreateServer {
	app: express.Application;
	bodyParser: express.Handler;
	logger: Logger;
	movieRouter: ExpressRouter;
	ApiErrorClass: typeof ApiError;
	errorHandler: ExpressErrorHandler<void>;
}

export function createServer({
	app,
	bodyParser,
	movieRouter,
	ApiErrorClass,
	errorHandler,
	logger,
}: ICreateServer): Server {
	let server: http.Server | undefined;

	return {
		setup,
		run,
		stop,
	};

	function setup() {
		app.use(bodyParser);
		app.use('/api/movies', movieRouter);
		app.all('*', async () => {
			throw ApiErrorClass.notFound('Route not found');
		});
		app.use(errorHandler);
		logger.info('[SERVER] Middleware attached');
	}

	function run(port: number) {
		server = app.listen(port, () => {
			logger.info(`[SERVER] Server running on port ${port}`);
		});
	}

	function stop(done: ServerDone) {
		if (!server) {
			logger.error('[SERVER] Server can be stopped as is not started');
			return;
		}
		server.close(done);
		logger.info('[SERVER] Server closed');
	}
}
