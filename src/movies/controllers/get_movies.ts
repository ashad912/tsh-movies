import { Request, Response } from 'express';

import { MovieService } from '../movie_service';
import { GenreService } from '../../genres/genre_service';
import { Logger } from '../../logger/logger';

type IGetMoviesController = {
	movieService: MovieService;
	genreService: GenreService;
	logger: Logger;
};

export function getMoviesController({
	movieService,
	genreService,
	logger,
}: IGetMoviesController) {
	return getMovies;

	async function getMovies(req: Request, res: Response) {
		logger.debug('[GET_MOVIES CONTROLLER] Getting query parameters');
		const { genres, duration } = req.query;
		logger.debug(
			`[GET_MOVIES CONTROLLER] Query parameters: ${genres} ${duration}`,
		);

		logger.debug('[GET_MOVIES CONTROLLER] Getting movie(s)');
		const movies = await movieService.getMovies(
			{ genres, duration },
			genreService.verifyGenres,
		);

		logger.debug('[GET_MOVIES CONTROLLER] Returning movie(s) ' + movies.length);

		res.json(movies);
	}
}
