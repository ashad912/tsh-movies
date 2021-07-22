import * as awilix from 'awilix';
import * as faker from 'faker';

import { Movie, MovieRecord } from './movie.type';

import { Genre } from '../genres/genre.type';
import { MovieService } from './movie_service';

test('Can create MovieService instance', canCreateMovieService);
test('Cannot create a movie using createMovie method', cannotCreateMovie);
test('Can create a movie using createMovie method', canCreateMovie);

describe('Can get random movie array', canGetRandomMovieArray);

test(
	'Cannot get movie array if genres verification fail',
	cannotGetMoviesIfInvalidGenres,
);

describe('Can get movie array by genres', canGetMovieArrayByGenres);

function canGetMovieArrayByGenres() {
	test(
		'containing exactly zero movies if there is no existing movies',
		zeroMoviesNoMovies,
	);
	test(
		'containing exactly expected movies if duration parsed query is NaN',
		expectedMoviesNoDuration,
	);
	test(
		'containing exactly expected movies if duration parsed query is number but out of existing range',
		expectedMoviesDurationOutOfRange,
	);
	test(
		'containing exactly expected movies regarding to duration',
		expectedMoviesWithDuration,
	);

	async function expectedMoviesWithDuration() {
		const duration = faker.datatype.number({ min: 30, max: 200 });

		const GENRE_1 = faker.random.word();
		const GENRE_2 = faker.random.word();
		const GENRE_3 = faker.random.word();
		const GENRE_4 = faker.random.word();
		const GENRE_5 = faker.random.word();

		const movies = [
			createRandomMovieRecord({
				runtime: getRuntime(duration - 12),
				genres: [GENRE_2, GENRE_4],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration + 1),
				genres: [GENRE_2, GENRE_3],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration + 9),
				genres: [GENRE_1, GENRE_2, GENRE_3, GENRE_4],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration - 8),
				genres: [],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration + 8),
				genres: [GENRE_5],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration + 11),
				genres: [GENRE_4],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration - 2),
				genres: [GENRE_1, GENRE_2],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration - 20),
				genres: [GENRE_5],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration + 4),
				genres: [GENRE_1, GENRE_2, GENRE_3],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration + 30),
				genres: [GENRE_4, GENRE_2, GENRE_1],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration - 10),
				genres: [GENRE_3, GENRE_2],
			}),
			createRandomMovieRecord({
				runtime: getRuntime(duration + 10),
				genres: [GENRE_3],
			}),
		];

		await testWith({
			query: {
				duration: duration.toString(),
				genres: `${GENRE_1}, ${GENRE_2}, ${GENRE_3}, ${GENRE_4}`,
			},
			existingMovies: movies,
			expected: [movies[2], movies[8], movies[6], movies[1]],
		});

		function getRuntime(duration: number) {
			return duration.toString();
		}
	}
	async function expectedMoviesDurationOutOfRange() {
		const duration = faker.datatype.number({ min: 20, max: 200 });
		const min = duration - 9;
		const max = duration + 9;

		const GENRE_1 = faker.random.word();
		const GENRE_2 = faker.random.word();
		const GENRE_3 = faker.random.word();
		const GENRE_4 = faker.random.word();
		const GENRE_5 = faker.random.word();

		const runtime = (duration + 50).toString();

		const movies = [
			createRandomMovieRecord({ runtime, genres: [GENRE_2, GENRE_4] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_2, GENRE_3] }),
			createRandomMovieRecord({
				runtime,
				genres: [GENRE_1, GENRE_2, GENRE_3, GENRE_4],
			}),
			createRandomMovieRecord({ runtime, genres: [] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_5] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_4] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_1, GENRE_2] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_5] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_1, GENRE_2, GENRE_3] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_4, GENRE_2, GENRE_1] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_3, GENRE_2] }),
			createRandomMovieRecord({ runtime, genres: [GENRE_3] }),
		];

		await testWith({
			query: {
				duration: faker.datatype.number({ min, max }).toString(),
				genres: [GENRE_1, GENRE_2, GENRE_3, GENRE_4],
			},
			existingMovies: movies,
			expected: [],
		});
	}

	async function expectedMoviesNoDuration() {
		const GENRE_1 = faker.random.word();
		const GENRE_2 = faker.random.word();
		const GENRE_3 = faker.random.word();
		const GENRE_4 = faker.random.word();
		const GENRE_5 = faker.random.word();

		const movies = [
			createRandomMovieRecord({ genres: [GENRE_2, GENRE_4] }),
			createRandomMovieRecord({ genres: [GENRE_2, GENRE_3] }),
			createRandomMovieRecord({ genres: [GENRE_1, GENRE_2, GENRE_3, GENRE_4] }),
			createRandomMovieRecord({ genres: [] }),
			createRandomMovieRecord({ genres: [GENRE_5] }),
			createRandomMovieRecord({ genres: [GENRE_4] }),
			createRandomMovieRecord({ genres: [GENRE_1, GENRE_2] }),
			createRandomMovieRecord({ genres: [GENRE_5] }),
			createRandomMovieRecord({ genres: [GENRE_1, GENRE_2, GENRE_3] }),
			createRandomMovieRecord({ genres: [GENRE_4, GENRE_2, GENRE_1] }),
			createRandomMovieRecord({ genres: [GENRE_3, GENRE_2] }),
			createRandomMovieRecord({ genres: [GENRE_3] }),
		];

		await testWith({
			query: {
				duration: NaN.toString(),
				genres: [GENRE_1, GENRE_2, GENRE_3, GENRE_4],
			},
			existingMovies: movies,
			expected: [
				movies[2],
				movies[8],
				movies[9],
				movies[6],
				movies[1],
				movies[10],
				movies[0],
				movies[11],
				movies[5],
			],
		});
	}

	async function zeroMoviesNoMovies() {
		const movies = [] as MovieRecord[];
		await testWith({
			query: {
				duration: undefined,
				genres: faker.random.words().split(' '),
			},
			existingMovies: movies,
			expected: [],
		});
	}

	async function testWith({
		query,
		existingMovies,
		expected,
	}: {
		query: Query;
		existingMovies: MovieRecord[];
		expected: MovieRecord[];
	}) {
		const mocked = setup(existingMovies);
		const container = setupContainer(mocked);

		const { logger, genreService, movieRepository } = mocked;

		const movieService = container.resolve('movieService') as MovieService;

		const movies = await movieService.getMovies(
			query,
			genreService.verifyGenres,
		);

		expect(movieRepository.find).toHaveBeenCalledWith();
		expect(logger.debug).toBeCalled();
		expect(
			logger.debug.mock.calls.every((call: string[]) =>
				call[0].includes('[MOVIE SERVICE]'),
			),
		).toBeTruthy();

		expect(movies).toEqual(expected);
	}

	function setup(fakeMovies: MovieRecord[]) {
		return {
			movieRepository: {
				find: jest.fn().mockResolvedValue(fakeMovies),
			},
			logger: {
				debug: jest.fn(),
			},
			ApiErrorClass: jest.fn(),
			genreService: {
				verifyGenres: jest.fn().mockResolvedValue(true),
			},
		};
	}
}

async function cannotGetMoviesIfInvalidGenres() {
	const fakeError = faker.random.words();

	const fakeQuery = {
		genres: faker.random
			.words(faker.datatype.number({ min: 1, max: 20 }))
			.split(' '),
		duration: undefined,
	};

	const mockVerifyGenres = jest.fn().mockResolvedValue(false);

	const mocked = setup();
	const container = setupContainer(mocked);

	const { logger, movieRepository } = mocked;

	const movieService = container.resolve('movieService') as MovieService;

	await expect(invokeCreateMovie).rejects.toThrow(fakeError);

	expect(movieRepository.find).toHaveBeenCalledWith();
	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[MOVIE SERVICE]'),
		),
	).toBeTruthy();
	expect(mockVerifyGenres).toHaveBeenCalledWith(
		fakeQuery.genres.map((genre) => genre.trim().toLowerCase()),
	);

	async function invokeCreateMovie() {
		await movieService.getMovies(fakeQuery, mockVerifyGenres);
	}

	function setup() {
		return {
			movieRepository: {
				find: jest.fn(),
			},
			ApiErrorClass: {
				badRequest: jest.fn().mockImplementation(() => {
					return Error(fakeError);
				}),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

function canGetRandomMovieArray() {
	test(
		'containing exactly zero movies if there is no existing movies',
		zeroMoviesNoMovies,
	);
	test(
		'containing exactly one movie if no query parameters provided',
		oneMovieNoQuery,
	);
	test(
		'containing exactly one movie if duration provided but NaN',
		oneMovieDurationNaN,
	);
	test(
		'containing exactly zero movies if duration is valid number but out of existing range',
		zeroMoviesWithDuration,
	);
	test(
		'containing exactly one movie from range if duration is valid number',
		oneMovieWithDuration,
	);

	async function oneMovieWithDuration() {
		const duration = faker.datatype.number({ min: 20, max: 200 });
		const min = duration - 9;
		const max = duration + 9;

		const movies = Array.from(
			{
				length: faker.datatype.number({ min: 1, max: 20 }),
			},
			() => createRandomMovieRecord({ runtime: duration.toString() }),
		);

		await testWith({
			query: {
				duration: faker.datatype.number({ min, max }).toString(),
				genres: undefined,
			},
			existingMovies: movies,
			expectedCondition: (receivedMovies: MovieRecord[]) => {
				if (receivedMovies.length !== 1) return false;
				return movies.some(
					(movie) =>
						movie.id === receivedMovies[0].id &&
						durationInRange(movie.runtime, receivedMovies[0].runtime),
				);
			},
		});

		function durationInRange(test: string, expected: string) {
			return Math.abs(parseInt(test) - parseInt(expected)) < 10;
		}
	}

	async function zeroMoviesWithDuration() {
		const duration = faker.datatype.number({ min: 20, max: 200 });
		const min = duration - 9;
		const max = duration + 9;

		const movies = Array.from(
			{
				length: faker.datatype.number({ min: 1, max: 20 }),
			},
			() => createRandomMovieRecord({ runtime: (duration + 50).toString() }),
		);

		await testWith({
			query: {
				duration: faker.datatype.number({ min, max }).toString(),
				genres: undefined,
			},
			existingMovies: movies,
			expectedCondition: (receivedMovies: MovieRecord[]) => {
				return !receivedMovies.length;
			},
		});
	}

	async function oneMovieDurationNaN() {
		const movies = Array.from(
			{
				length: faker.datatype.number({ min: 1, max: 20 }),
			},
			createRandomMovieRecord,
		);

		await testWith({
			query: {
				duration: faker.random.word(),
				genres: undefined,
			},
			existingMovies: movies,
			expectedCondition: (receivedMovies: MovieRecord[]) => {
				if (receivedMovies.length !== 1) return false;
				return movies.some((movie) => movie.id === receivedMovies[0].id);
			},
		});
	}

	async function oneMovieNoQuery() {
		const movies = Array.from(
			{ length: faker.datatype.number({ min: 1, max: 20 }) },
			createRandomMovieRecord,
		);
		await testWith({
			query: {
				duration: undefined,
				genres: undefined,
			},
			existingMovies: movies,
			expectedCondition: (receivedMovies: MovieRecord[]) => {
				if (receivedMovies.length !== 1) return false;
				return movies.some((movie) => movie.id === receivedMovies[0].id);
			},
		});
	}

	async function zeroMoviesNoMovies() {
		const movies = [] as MovieRecord[];
		await testWith({
			query: {
				duration: undefined,
				genres: undefined,
			},
			existingMovies: movies,
			expectedCondition: (receivedMovies: MovieRecord[]) => {
				return !receivedMovies.length;
			},
		});
	}

	async function testWith({
		query,
		existingMovies,
		expectedCondition,
	}: {
		query: Query;
		existingMovies: MovieRecord[];
		expectedCondition: (receivedMovies: MovieRecord[]) => boolean;
	}) {
		const mocked = setup(existingMovies);
		const container = setupContainer(mocked);

		const { logger, genreService, movieRepository } = mocked;

		const movieService = container.resolve('movieService') as MovieService;

		const movies = await movieService.getMovies(
			query,
			genreService.verifyGenres,
		);

		expect(movieRepository.find).toHaveBeenCalledWith();
		expect(logger.debug).toBeCalled();
		expect(
			logger.debug.mock.calls.every((call: string[]) =>
				call[0].includes('[MOVIE SERVICE]'),
			),
		).toBeTruthy();

		expect(expectedCondition(movies)).toEqual(true);
	}

	function setup(fakeMovies: MovieRecord[]) {
		return {
			movieRepository: {
				find: jest.fn().mockResolvedValue(fakeMovies),
			},
			logger: {
				debug: jest.fn(),
			},
			ApiErrorClass: jest.fn(),
			genreService: {
				verifyGenres: jest.fn(),
			},
		};
	}
}

async function canCreateMovie() {
	const fakeMovie = createRandomMovie();
	const fakeMovieRecord = { ...fakeMovie, id: faker.datatype.number() };

	const mockVerifyGenres = jest.fn().mockResolvedValue(true);

	const mocked = setup();
	const container = setupContainer(mocked);

	const { logger, movieRepository } = mocked;

	const movieService = container.resolve('movieService') as MovieService;

	const movieRecord = await movieService.createMovie(
		fakeMovie,
		mockVerifyGenres,
	);

	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[MOVIE SERVICE]'),
		),
	).toBeTruthy();
	expect(mockVerifyGenres).toHaveBeenCalledWith(fakeMovie.genres);
	expect(movieRepository.create).toHaveBeenCalledWith(fakeMovie);
	expect(movieRecord).toEqual(fakeMovieRecord);

	function setup() {
		return {
			movieRepository: {
				create: jest.fn().mockResolvedValue(fakeMovieRecord),
			},
			ApiErrorClass: jest.fn(),
			logger: {
				debug: jest.fn(),
			},
		};
	}
}
async function cannotCreateMovie() {
	const fakeError = faker.random.words();
	const fakeMovie = createRandomMovie();

	const mockVerifyGenres = jest.fn().mockResolvedValue(false);

	const mocked = setup();
	const container = setupContainer(mocked);

	const { logger, movieRepository } = mocked;

	const movieService = container.resolve('movieService') as MovieService;

	await expect(invokeCreateMovie).rejects.toThrow(fakeError);

	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[MOVIE SERVICE]'),
		),
	).toBeTruthy();
	expect(mockVerifyGenres).toHaveBeenCalledWith(fakeMovie.genres);
	expect(movieRepository.create).not.toBeCalled();

	async function invokeCreateMovie() {
		await movieService.createMovie(fakeMovie, mockVerifyGenres);
	}

	function setup() {
		return {
			movieRepository: {
				create: jest.fn(),
			},
			ApiErrorClass: {
				badRequest: jest.fn().mockImplementation(() => {
					return Error(fakeError);
				}),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

function canCreateMovieService() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const movieService = container.resolve('movieService') as MovieService;

	expect(movieService).toBeDefined();

	function setup() {
		return {
			movieRepository: jest.fn(),
			ApiErrorClass: jest.fn(),
			logger: jest.fn(),
		};
	}
}

function createRandomMovie(opts?: {
	runtime?: string;
	genres?: Genre[];
}): Movie {
	return {
		title: faker.random.words(3),
		year: faker.random.word(),
		runtime: opts?.runtime || faker.random.word(),
		genres: opts?.genres || [],
		director: faker.random.word(),
	};
}

function createRandomMovieRecord(opts?: {
	runtime?: string;
	genres?: Genre[];
}): MovieRecord {
	return {
		id: parseInt(Date.now().toString() + Math.floor(Math.random() * 10000)),
		...createRandomMovie(opts),
	};
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		movieService: awilix.asClass(MovieService).inject(() => mocked),
	});

	return container;
}

type Query = {
	duration: string | string[] | undefined;
	genres: string | string[] | undefined;
};
