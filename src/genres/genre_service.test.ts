import * as awilix from 'awilix';
import * as faker from 'faker';

import { Genre } from './genre.type';

import { GenreService } from './genre_service';

test('Can create GenreService instance', canCreateGenreService);
test('Can use getAllGenres method', canUseGetAllGenres);

describe('Cannot verify genres using verifyGenres method', cannotVerifyGenres);
describe('Can verify genres using verifyGenres method', canVerifyGenres);

function canVerifyGenres() {
	test('with both verifying and existing empty', genreVeryfingExistingEmpty);
	test('with verifying empty', genreVeryfingEmpty);
	test('with genre included in existing', genreIncludedInExisting);
	test('with few genres included in existing', fewGenresIncludedInExisting);
	test('with nonempty veryfing genres as existing', genresVeryfingAsExisting);
	test(
		'with nonempty veryfing genres as existing with case insensitive',
		genresVeryfingAsExistingCaseInsensitive,
	);

	async function genresVeryfingAsExistingCaseInsensitive() {
		const genresNumber = faker.datatype.number({ min: 1, max: 20 });
		const existingGenres = faker.random.words(genresNumber).split(' ');

		await testWith({
			existing: existingGenres,
			toVerify: existingGenres.map((genre) => genre.toUpperCase()),
		});
	}
	async function genresVeryfingAsExisting() {
		const genresNumber = faker.datatype.number({ min: 1, max: 20 });
		const existingGenres = faker.random.words(genresNumber).split(' ');

		await testWith({
			existing: existingGenres,
			toVerify: existingGenres,
		});
	}

	async function fewGenresIncludedInExisting() {
		const genresNumber = faker.datatype.number({ min: 3, max: 20 });
		const existingGenres = faker.random.words(genresNumber).split(' ');
		const toVerifyGenres = existingGenres.slice(
			Math.floor(Math.random() * genresNumber) || 2,
		);

		await testWith({
			existing: existingGenres,
			toVerify: toVerifyGenres,
		});
	}

	async function genreIncludedInExisting() {
		const genresNumber = faker.datatype.number({ min: 1, max: 20 });
		const existingGenres = faker.random.words(genresNumber).split(' ');
		const toVerifyGenre =
			existingGenres[Math.floor(Math.random() * genresNumber)];

		await testWith({
			existing: existingGenres,
			toVerify: [toVerifyGenre],
		});
	}

	async function genreVeryfingEmpty() {
		const genresNumber = faker.datatype.number({ min: 1, max: 20 });
		const existingGenres = faker.random.words(genresNumber).split(' ');

		await testWith({
			existing: existingGenres,
			toVerify: [],
		});
	}

	async function genreVeryfingExistingEmpty() {
		await testWith({
			existing: [],
			toVerify: [],
		});
	}

	async function testWith({
		existing,
		toVerify,
	}: {
		existing: Genre[];
		toVerify: Genre[];
	}) {
		const mocked = setup(existing);
		const container = setupContainer(mocked);

		const { logger } = mocked;

		const genreService = container.resolve('genreService') as GenreService;

		const verificationResult = await genreService.verifyGenres(toVerify);

		expect(logger.debug).toBeCalled();
		expect(
			logger.debug.mock.calls.every((call: string[]) =>
				call[0].includes('[GENRE SERVICE]'),
			),
		).toBeTruthy();

		expect(verificationResult).toEqual(true);
	}

	function setup(fakeGenres: Genre[]) {
		return {
			genreRepository: {
				find: jest.fn().mockResolvedValue(fakeGenres),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

function cannotVerifyGenres() {
	test('with genre while existing empty', genreExistingEmpty);
	test('with genre not incuded in existing', genreNotIncluded);
	test(
		'with one of genres not included in existing one element array',
		oneOfGenresNotIncludedForOneElArray,
	);
	test('with one of genres not included in existing', oneOfGenresNotIncluded);

	async function oneOfGenresNotIncluded() {
		const genresNumber = faker.datatype.number({ min: 1, max: 20 });
		const existingGenres = faker.random.words(genresNumber).split(' ');
		const toVerifyGenre = faker.unique(faker.random.word, [], {
			exclude: existingGenres,
		});
		await testWith({
			existing: existingGenres,
			toVerify: [existingGenres[0], toVerifyGenre],
		});
	}

	async function oneOfGenresNotIncludedForOneElArray() {
		const existingGenre = faker.random.word();
		const toVerifyGenre = faker.unique(faker.random.word, [], {
			exclude: [existingGenre],
		});
		await testWith({
			existing: [existingGenre],
			toVerify: [existingGenre, toVerifyGenre],
		});
	}

	async function genreNotIncluded() {
		const genresNumber = faker.datatype.number({ min: 1, max: 20 });
		const existingGenres = faker.random.words(genresNumber).split(' ');
		const toVerifyGenre = faker.unique(faker.random.word, [], {
			exclude: existingGenres,
		});
		await testWith({
			existing: existingGenres,
			toVerify: [toVerifyGenre],
		});
	}

	async function genreExistingEmpty() {
		await testWith({
			existing: [],
			toVerify: [faker.random.word()],
		});
	}

	async function testWith({
		existing,
		toVerify,
	}: {
		existing: Genre[];
		toVerify: Genre[];
	}) {
		const mocked = setup(existing);
		const container = setupContainer(mocked);

		const { logger } = mocked;

		const genreService = container.resolve('genreService') as GenreService;

		const verificationResult = await genreService.verifyGenres(toVerify);

		expect(logger.debug).toBeCalled();
		expect(
			logger.debug.mock.calls.every((call: string[]) =>
				call[0].includes('[GENRE SERVICE]'),
			),
		).toBeTruthy();

		expect(verificationResult).toEqual(false);
	}

	function setup(fakeGenres: Genre[]) {
		return {
			genreRepository: {
				find: jest.fn().mockResolvedValue(fakeGenres),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

async function canUseGetAllGenres() {
	const fakeGenres = faker.random.words().split(' ') as Genre[];

	const mocked = setup();
	const container = setupContainer(mocked);

	const { logger, genreRepository } = mocked;

	const genreService = container.resolve('genreService') as GenreService;

	const genres = await genreService.getAllGenres();

	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[GENRE SERVICE]'),
		),
	).toBeTruthy();
	expect(genreRepository.find).toHaveBeenCalledWith();
	expect(genres).toEqual(fakeGenres);

	function setup() {
		return {
			genreRepository: {
				find: jest.fn().mockResolvedValue(fakeGenres),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

function canCreateGenreService() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const genreService = container.resolve('genreService') as GenreService;

	expect(genreService).toBeDefined();

	function setup() {
		return {
			genreRepository: jest.fn(),
			logger: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		genreService: awilix.asClass(GenreService).inject(() => mocked),
	});

	return container;
}
