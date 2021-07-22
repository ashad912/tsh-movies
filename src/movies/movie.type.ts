import { Genre } from '../genres/genre.type';

export type Movie = {
	title: string;
	year: string;
	runtime: string;
	genres: Genre[];
	director: string;
	actors?: string;
	plot?: string;
	posterUrl?: string;
};

export type MovieRecord = Movie & {
	id: number;
};
