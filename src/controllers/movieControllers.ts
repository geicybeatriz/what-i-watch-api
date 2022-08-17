import { Request, Response } from "express";
import moviesServices from "../services/movieServices.js";

async function addMovies(req:Request, res:Response){
    const {userId} = res.locals.userId;
    const listId = +req.params.listId;

    await moviesServices.insertMovie({...req.body, listId:listId}, parseInt(userId));
    res.sendStatus(201);
}

async function getMoviesByList(req:Request, res:Response){
    const {userId} = res.locals.userId;
    const listId = +req.params.listId;

    const movies = await moviesServices.findMoviesByList(listId, parseInt(userId));
    res.status(200).send(movies);
}

async function removeMovieById(req:Request, res:Response){
    const {userId} = res.locals.userId;
    const listId = +req.params.listId;
    const movieId = +req.params.movieId;

    await moviesServices.removeMovie(movieId, parseInt(userId), listId);
    res.sendStatus(200);
}

const movieControllers = {
    addMovies,
    removeMovieById,
    getMoviesByList
}

export default movieControllers;