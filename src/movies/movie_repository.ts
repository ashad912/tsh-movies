import { Movie, MovieRecord } from './movie.type';
import { DataSource } from '../data_source/data_source';
import { Logger } from '../logger/logger';

interface IMovieRepository {
	find(): Promise<MovieRecord[]>;
	create(movie: Movie): Promise<MovieRecord>;
}

export class MovieRepository implements IMovieRepository {
	private dataSource: DataSource;
	private logger: Logger;

	constructor({
		dataSource,
		logger,
	}: {
		dataSource: DataSource;
		logger: Logger;
	}) {
		this.dataSource = dataSource;
		this.logger = logger;
	}

	async find() {
		this.logger.debug('[MOVIE REPOSITORY] Reading data source');
		const db = await this.dataSource.read();
		return db.movies;
	}

	async create(movie: Movie) {
		this.logger.debug('[MOVIE REPOSITORY] Reading data source');
		const db = await this.dataSource.read();

		this.logger.debug('[MOVIE REPOSITORY] Creating movie record');
		const movieRecord: MovieRecord = { id: generatePseudouniqueId(), ...movie };

		db.movies.push(movieRecord);

		this.logger.debug('[MOVIE REPOSITORY] Writing data source with new movie');
		await this.dataSource.write(db);

		return movieRecord;
	}
}

function generatePseudouniqueId(): number {
	return parseInt(Date.now().toString() + Math.floor(Math.random() * 10000));
}
