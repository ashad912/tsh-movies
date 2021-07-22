import * as awilix from 'awilix';
import faker from 'faker';

import { Request, Response } from 'express';
import { ExpressHandler } from '../../server/express.type';

import { addMovieController } from './add_movie';
import { MovieRecord } from '../movie.type';

test('Can create addMovieController', canCreateAddMovieController);
test('Can use addMovie function', canUseAddMovie);

async function canUseAddMovie() {
	const fakeMovieRecord = createRandomMovieRecord();

	const mocked = setup();

	const { logger, movieService, genreService } = mocked;

	const fakeRequest = {
		body: jest.fn(),
	} as Request;
	const fakeResponse = {
		json: jest.fn(),
	} as any as Response;

	const container = setupContainer(mocked);

	const addMovie = container.resolve('addMovieController') as ExpressHandler<
		Promise<void>
	>;

	await addMovie(fakeRequest, fakeResponse);

	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[ADD_MOVIE CONTROLLER]'),
		),
	).toBeTruthy();
	expect(movieService.createMovie).toHaveBeenCalledWith(
		fakeRequest.body,
		genreService.verifyGenres,
	);
	expect(fakeResponse.json).toHaveBeenCalledWith(fakeMovieRecord);

	function setup() {
		return {
			movieService: {
				createMovie: jest.fn().mockResolvedValue(fakeMovieRecord),
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

	const addMovieController = container.resolve(
		'addMovieController',
	) as ExpressHandler<Promise<void>>;

	expect(addMovieController).toBeDefined();

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
		addMovieController: awilix
			.asFunction(addMovieController)
			.inject(() => mocked),
	});

	return container;
}
