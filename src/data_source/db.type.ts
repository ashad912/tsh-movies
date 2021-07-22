import { Genre } from '../genres/genre.type';
import { MovieRecord } from '../movies/movie.type';

export type DB = {
	genres: Genre[];
	movies: MovieRecord[];
};
