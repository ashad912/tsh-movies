import { Request, Response } from 'express';

import { MovieService } from '../movie_service';
import { GenreService } from '../../genres/genre_service';
import { Logger } from '../../logger/logger';

export interface IAddMovieController {
	movieService: MovieService;
	genreService: GenreService;
	logger: Logger;
}

export function addMovieController({
	movieService,
	genreService,
	logger,
}: IAddMovieController) {
	return addMovie;

	async function addMovie(req: Request, res: Response) {
		logger.debug('[ADD_MOVIE CONTROLLER] Adding movie');

		const movieRecord = await movieService.createMovie(
			req.body,
			genreService.verifyGenres,
		);

		logger.debug('[ADD_MOVIE CONTROLLER] Returning movie record');
		res.json(movieRecord);
	}
}
