import { Genre } from './genre.type';
import { GenreRepository } from './genre_repository';
import { Logger } from '../logger/logger';

interface IGenreService {
	getAllGenres(): Promise<string[]>;
	verifyGenres(genresToVerify: Genre[]): Promise<boolean>;
}

type GenreServiceController = {
	genreRepository: GenreRepository;
	logger: Logger;
};

export class GenreService implements IGenreService {
	private genreRepository: GenreRepository;
	private logger: Logger;

	constructor({ genreRepository, logger }: GenreServiceController) {
		this.genreRepository = genreRepository;
		this.logger = logger;
	}

	private debug(message: string) {
		this.logger.debug(`[GENRE SERVICE] ${message}`);
	}

	async getAllGenres() {
		this.debug(`Quering genres`);

		const allGenres = await this.genreRepository.find();
		return allGenres;
	}

	verifyGenres = async (genresToVerify: Genre[]) => {
		const existingGenres = await this.getAllGenres();

		this.debug(`Lowercasing existing genres`);
		const existingGenresLc = existingGenres.map((genre) => genre.toLowerCase());

		this.debug(`Verifying genres`);

		if (
			genresToVerify.every((genre) =>
				existingGenresLc.includes(genre.toLowerCase()),
			)
		) {
			this.debug(`Genres verified`);
			return true;
		}

		this.debug(`Genres verification fail`);
		return false;
	};
}
