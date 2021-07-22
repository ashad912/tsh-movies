import * as awilix from 'awilix';
import faker from 'faker';

import { Request, Response } from 'express';
import { ExpressHandler } from '../../server/express.type';

import { getMoviesController } from './get_movies';
import { MovieRecord } from '../movie.type';

test('Can create getMoviesController', canCreateAddMovieController);
test('Can use getMovies function', canUseAddMovie);

async function canUseAddMovie() {
	const fakeMovieRecords = Array.from(
		{ length: faker.datatype.number({ min: 1, max: 20 }) },
		createRandomMovieRecord,
	);

	const mocked = setup();

	const { logger, movieService, genreService } = mocked;

	const fakeRequest = {
		body: jest.fn(),
		query: {
			genres: jest.fn(),
			duration: jest.fn(),
		},
	} as any as Request;

	const fakeResponse = {
		json: jest.fn(),
	} as any as Response;

	const container = setupContainer(mocked);

	const getMovies = container.resolve('getMoviesController') as ExpressHandler<
		Promise<void>
	>;

	await getMovies(fakeRequest, fakeResponse);

	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[GET_MOVIES CONTROLLER]'),
		),
	).toBeTruthy();
	expect(movieService.getMovies).toHaveBeenCalledWith(
		{
			genres: fakeRequest.query.genres,
			duration: fakeRequest.query.duration,
		},
		genreService.verifyGenres,
	);
	expect(fakeResponse.json).toHaveBeenCalledWith(fakeMovieRecords);

	function setup() {
		return {
			movieService: {
				getMovies: jest.fn().mockResolvedValue(fakeMovieRecords),
			},
			genreService: {
				verifyGenres: jest.fn(),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

function canCreateAddMovieController() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const getMoviesController = container.resolve(
		'getMoviesController',
	) as ExpressHandler<Promise<void>>;

	expect(getMoviesController).toBeDefined();

	function setup() {
		return {
			movieService: jest.fn(),
			genreService: jest.fn(),
			logger: jest.fn(),
		};
	}
}

function createRandomMovieRecord(): MovieRecord {
	return {
		id: parseInt(Date.now().toString() + Math.floor(Math.random() * 10000)),
		title: faker.random.words(3),
		year: faker.random.word(),
		runtime: faker.random.word(),
		genres: [],
		director: faker.random.word(),
	};
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		getMoviesController: awilix
			.asFunction(getMoviesController)
			.inject(() => mocked),
	});

	return container;
}
