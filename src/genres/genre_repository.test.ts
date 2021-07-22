import * as awilix from 'awilix';
import faker from 'faker';
import { Genre } from './genre.type';

import { GenreRepository } from './genre_repository';

test('Can create GenreRepository instance', canCreateGenreRepository);
test('Can use find method', canUseFind);

async function canUseFind() {
	const fakeDB = {
		genres: faker.random.words().split(' ') as Genre[],
		movies: [],
	};

	const mocked = setup();
	const container = setupContainer(mocked);

	const { logger, dataSource } = mocked;

	const genreRepository = container.resolve(
		'genreRepository',
	) as GenreRepository;

	const genres = await genreRepository.find();

	expect(logger.debug).toBeCalled();
	expect(
		logger.debug.mock.calls.every((call: string[]) =>
			call[0].includes('[GENRE REPOSITORY]'),
		),
	).toBeTruthy();
	expect(dataSource.read).toHaveBeenCalledWith();
	expect(genres).toEqual(fakeDB.genres);

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

function canCreateGenreRepository() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const genreRepository = container.resolve(
		'genreRepository',
	) as GenreRepository;

	expect(genreRepository).toBeDefined();

	function setup() {
		return {
			dataSource: jest.fn(),
			logger: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		genreRepository: awilix.asClass(GenreRepository).inject(() => mocked),
	});

	return container;
}
