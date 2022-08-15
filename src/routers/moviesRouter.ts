import { Router } from "express";
import movieControllers from "../controllers/movieControllers.js";
import validateSchemas from "../middlewares/schemaValidationMiddleware.js";
import tokenValidation from "../middlewares/tokenValidationMiddleware.js";
import moviesSchemas from "../schemas/movieSchema.js";

const moviesRouter = Router();

moviesRouter.post("/movies/:listId", tokenValidation, validateSchemas(moviesSchemas.movie), movieControllers.addMovies);
moviesRouter.get("/movies/:listId", tokenValidation, movieControllers.getMoviesByList);
moviesRouter.delete("/:listId/:movieId", tokenValidation, movieControllers.removeMovieById);

export default moviesRouter;