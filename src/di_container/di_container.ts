import path from 'path';
import fs from 'fs';

import * as awilix from 'awilix';
import express from 'express';
import 'express-async-errors';
import winston from 'winston';

import { Logger } from '../logger/logger';

import { DataSource } from '../data_source/data_source';

import { MovieService } from '../movies/movie_service';
import { MovieRepository } from '../movies/movie_repository';

import { GenreRepository } from '../genres/genre_repository';
import { GenreService } from '../genres/genre_service';

import { ApiError } from '../errors/api_error';
import { createErrorHandler } from '../errors/error_handler';

import { ValidationSchema } from '../validation/validation_schema';
import { getAddMovieImplementation } from '../validation/movie_schema';

import { getMoviesController } from '../movies/controllers/get_movies';
import { addMovieController } from '../movies/controllers/add_movie';

import { createServer } from '../server/server';
import { createMovieRouter } from '../movies/movie_router';
import { validator } from '../validation/validator';

export function setupContainer() {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		ApiErrorClass: awilix.asValue(ApiError),
		logger: awilix.asClass(Logger).inject(() => ({
			implementation: winston,
			config: {
				level: 'debug',
				transports: [new winston.transports.Console()],
				format: winston.format.cli(),
			},
		})),
		dataSource: awilix.asClass(DataSource).inject(() => ({
			dbFileName: getDBPath('../data_source/db.json'),
			fs: fs.promises,
		})),
		movieRepository: awilix.asClass(MovieRepository),
		genreRepository: awilix.asClass(GenreRepository),
		movieService: awilix.asClass(MovieService),
		genreService: awilix.asClass(GenreService),
		errorHandler: awilix.asFunction(createErrorHandler),
		addMovieValidator: awilix.asFunction(validator).inject(() => ({
			validationSchema: new ValidationSchema({
				implementation: getAddMovieImplementation(),
			}),
		})),
		addMovieController: awilix.asFunction(addMovieController),
		getMoviesController: awilix.asFunction(getMoviesController),
		movieRouter: awilix.asFunction(createMovieRouter).inject(() => ({
			router: express.Router(),
		})),
		server: awilix.asFunction(createServer).inject(() => ({
			app: express(),
			bodyParser: express.json(),
		})),
	});

	return container;

	function getDBPath(dbPath: string) {
		return path.join(path.resolve(__dirname), dbPath);
	}
}
