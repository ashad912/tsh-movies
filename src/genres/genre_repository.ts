import { Genre } from './genre.type';
import { DataSource } from '../data_source/data_source';
import { Logger } from '../logger/logger';

interface IGenreRepository {
	find(): Promise<Genre[]>;
}

export class GenreRepository implements IGenreRepository {
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
		this.logger.debug('[GENRE REPOSITORY] Reading data source');
		const db = await this.dataSource.read();
		return db.genres;
	}
}
