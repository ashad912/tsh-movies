import joi from 'joi';

export function getAddMovieImplementation() {
	return joi.object({
		title: joi.string().min(1).max(255).required(),
		year: joi.string().min(1).required(),
		runtime: joi.string().regex(/^\d+$/).min(1).required(),
		genres: joi.array().items(joi.string().min(1)).min(1).required(),
		director: joi.string().min(1).max(255),
		actors: joi.string().min(1),
		plot: joi.string().min(1),
		posterUrl: joi.string().min(1),
	});
}
