import { Movie, MovieRecord } from './movie.type';

import { MovieRepository } from './movie_repository';
import { ApiError } from '../errors/api_error';
import { Logger } from '../logger/logger';

import { Genre } from '../genres/genre.type';
import { GenreService } from '../genres/genre_service';

interface IMovieService {
	getMovies(
		query: GetMoviesQuery,
		verifyGenres: GenreService['verifyGenres'],
	): Promise<MovieRecord[]>;
	createMovie(
		movie: Movie,
		verifyGenres: GenreService['verifyGenres'],
	): Promise<MovieRecord>;
}

type MovieServiceConstructor = {
	movieRepository: MovieRepository;
	ApiErrorClass: typeof ApiError;
	logger: Logger;
};

type GetMoviesQuery = {
	genres: any;
	duration: any;
};

export class MovieService implements IMovieService {
	private movieRepository: MovieRepository;
	private ApiErrorClass: typeof ApiError;
	private logger: Logger;

	constructor({
		movieRepository,
		ApiErrorClass,
		logger,
	}: MovieServiceConstructor) {
		this.movieRepository = movieRepository;
		this.ApiErrorClass = ApiErrorClass;
		this.logger = logger;
	}

	private debug(message: string) {
		this.logger.debug(`[MOVIE SERVICE] ${message}`);
	}

	async createMovie(movie: Movie, verifyGenres: GenreService['verifyGenres']) {
		this.debug(`Verifying genres`);

		if (!(await verifyGenres(movie.genres)))
			throw this.ApiErrorClass.badRequest(
				'Provided movie contains not existing genre',
			);

		return this.movieRepository.create(movie);
	}

	async getMovies(
		queryObject: GetMoviesQuery,
		verifyGenres: GenreService['verifyGenres'],
	) {
		const movies = await this.movieRepository.find();

		this.debug(`Parsing duration query`);

		const duration = parseInt(queryObject.duration);

		this.debug(`Got duration ${duration}`);

		if (!queryObject.genres)
			return this.getRandomMovieAsArray(movies, duration);

		this.debug(`Parsing genre query`);

		const genres: Genre[] = parseGenresQuery(queryObject.genres);

		this.debug(`Got genres ${genres.length}`);

		if (!(await verifyGenres(genres)))
			throw this.ApiErrorClass.badRequest(
				'Provided query contains not existing genre',
			);

		return this.getFilteredMovies(movies, duration, genres);

		function parseGenresQuery(genres: any) {
			if (Array.isArray(genres)) {
				return process(genres);
			}

			return process(genres.toString().split(','));
		}

		function process(genres: Genre[]) {
			return genres.map((genre) => genre.toString().trim().toLowerCase());
		}
	}

	private async getRandomMovieAsArray(movies: MovieRecord[], duration: number) {
		if (isNaN(duration)) {
			this.debug(`Duration query is NaN, returning random movie`);
			return movies.length ? [movies[getRandomIndex(movies)]] : [];
		}

		this.debug(`Duration query is number, filtering movies by duration`);
		const filteredMovies = filterMoviesByDuration(movies, duration, 10);

		this.debug(`Returning random of filtered movies`);
		return filteredMovies.length
			? [filteredMovies[getRandomIndex(filteredMovies)]]
			: [];

		function getRandomIndex(movies: MovieRecord[]) {
			return Math.floor(Math.random() * movies.length);
		}
	}

	private async getFilteredMovies(
		movies: MovieRecord[],
		duration: number,
		genres: Genre[],
	) {
		this.debug(`Filtering movies by duration`);
		const filteredMovies = isNaN(duration)
			? [...movies]
			: filterMoviesByDuration(movies, duration, 10);

		if (!filteredMovies.length) return [];

		this.debug(`Generating genres query set`);
		const genresQuerySet = generateQuerySet(genres);

		this.debug(`Getting results by genres query`);
		const results = filteredMovies
			.reduce(
				reduceToMoviesResults,
				genresQuerySet.map(() => [] as MovieRecord[]),
			)
			.flat();

		this.debug(`Returning movies`);
		return results;

		function reduceToMoviesResults(acc: MovieRecord[][], movie: MovieRecord) {
			const movieGenresLc = movie.genres.map((genre) => genre.toLowerCase());

			for (const [index, querySet] of genresQuerySet.entries()) {
				if (querySet.every((query) => movieGenresLc.includes(query))) {
					acc[index].push(movie);
					break;
				}
			}

			return acc;
		}
	}
}

function filterMoviesByDuration(
	movies: MovieRecord[],
	duration: number,
	range: number,
) {
	return movies.filter(
		(movie) => Math.abs(duration - parseInt(movie.runtime)) < range,
	);
}

function generateQuerySet(genres: Genre[]) {
	const powerSet = getAllSubsets(genres).filter((set) => set.length > 0);
	return powerSet.sort((a, b) => b.length - a.length);

	function getAllSubsets(array: string[]) {
		const subsets = [[]] as string[][];

		for (const el of array) {
			const last = subsets.length - 1;
			for (let i = 0; i <= last; i++) {
				subsets.push([...subsets[i], el]);
			}
		}

		return subsets;
	}
}
