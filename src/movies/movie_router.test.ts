import * as awilix from 'awilix';

import { createMovieRouter, IMovieRouter } from './movie_router';

test('Can create movie router', canCreateMovieRouter);

function canCreateMovieRouter() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const { router, addMovieValidator, addMovieController, getMoviesController } =
		mocked;

	const movieRouter = container.resolve('movieRouter') as IMovieRouter;

	expect(movieRouter).toBeDefined();
	expect(router.post).toHaveBeenCalledWith(
		'/',
		addMovieValidator,
		addMovieController,
	);
	expect(router.get).toHaveBeenCalledWith('/', getMoviesController);
	expect(movieRouter).toBe(router);

	function setup() {
		return {
			router: {
				post: jest.fn(),
				get: jest.fn(),
			},
			addMovieValidator: jest.fn(),
			addMovieController: jest.fn(),
			getMoviesController: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		movieRouter: awilix.asFunction(createMovieRouter).inject(() => mocked),
	});

	return container;
}
