import * as awilix from 'awilix';
import faker from 'faker';

import { MovieRecord } from './movie.type';

import { MovieRepository } from './movie_repository';

test('Can create MovieRepository instance', canCreateMovieRepository);
test('Can use find method', canUseFind);
test('Can use create method', canUseCreate);

async function canUseCreate() {
	const fakeDB = {
		genres: [],
		movies: Array.from(
			{ length: faker.datatype.number({ min: 1, max: 20 }) },
			createRandomMovieRecord,
		),
	};
	const fakeMovie = createRandomMovieRecord();

	const mocked = setup();
	const container = setupContainer(mocked);

	const { logger, dataSource } = mocked;

	const movieRepository = container.resolve(
		'movieRepository',
	) as MovieRepository;

	const movieRecord = await movieRepository.create(fakeMovie);

	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[MOVIE REPOSITORY]'),
		),
	).toBeTruthy();
	expect(dataSource.read).toHaveBeenCalledWith();
	expect(dataSource.write).toHaveBeenCalledWith(fakeDB);
	expect(
		fakeDB.movies.find((movie) => movie.id === movieRecord.id),
	).toBeTruthy();

	function setup() {
		return {
			dataSource: {
				read: jest.fn().mockResolvedValue(fakeDB),
				write: jest.fn(),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

async function canUseFind() {
	const fakeDB = {
		genres: [],
		movies: Array.from(
			{ length: faker.datatype.number({ min: 1, max: 20 }) },
			createRandomMovieRecord,
		),
	};

	const mocked = setup();
	const container = setupContainer(mocked);

	const { logger, dataSource } = mocked;

	const movieRepository = container.resolve(
		'movieRepository',
	) as MovieRepository;

	const movies = await movieRepository.find();

	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[MOVIE REPOSITORY]'),
		),
	).toBeTruthy();
	expect(dataSource.read).toHaveBeenCalledWith();
	expect(movies).toEqual(fakeDB.movies);

	function setup() {
		return {
			dataSource: {
				read: jest.fn().mockResolvedValue(fakeDB),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

function canCreateMovieRepository() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const movieRepository = container.resolve(
		'movieRepository',
	) as MovieRepository;

	expect(movieRepository).toBeDefined();

	function setup() {
		return {
			dataSource: jest.fn(),
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
		movieRepository: awilix.asClass(MovieRepository).inject(() => mocked),
	});

	return container;
}
