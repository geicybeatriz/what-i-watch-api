import Joi from "joi";

const movie = Joi.object({
    title: Joi.string().required(),
    image:Joi.string().required(),
    tmdbId:Joi.string().required()
});

const listMovie = Joi.object({
    name:Joi.string().required()
});

const moviesSchemas = {
    movie,
    listMovie
}

export default  moviesSchemas;