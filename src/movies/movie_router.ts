import {
	ExpressHandler,
	ExpressMiddleware,
	ExpressRouter,
} from '../server/express.type';

export interface IMovieRouter {
	router: ExpressRouter;
	addMovieValidator: ExpressMiddleware<void>;
	addMovieController: ExpressHandler<void>;
	getMoviesController: ExpressHandler<void>;
}

export function createMovieRouter({
	router,
	addMovieValidator,
	addMovieController,
	getMoviesController,
}: IMovieRouter) {
	router.post('/', addMovieValidator, addMovieController);
	router.get('/', getMoviesController);

	return router;
}
