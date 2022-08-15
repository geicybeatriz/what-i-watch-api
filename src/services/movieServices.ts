import listRepository from "../repositories/listRepository.js";
import movieRepository from "../repositories/movieRepository.js";
import listServices, { CreateMovieData } from "./listServices.js";

async function insertMovie(data:CreateMovieData, userId:number){
    await listServices.findUserById(userId);

    const listExist = await listRepository.findListById(data.listId, userId);
    if(!listExist) throw {type:"not found", message:"list is not found"};

    await movieRepository.insert(data);
    return;
}

async function findMoviesByList(listId:number, userId:number){
    await listServices.findUserById(userId);
    const listExist = await listRepository.findListById(listId, userId);
    if(!listExist) throw {type:"not found", message:"list is not found"};

    const movies = await movieRepository.findAllMoviesByListId(listId);
    return movies;
}

async function removeMovie(id:number, userId:number, listId:number){
    await listServices.findUserById(userId);

    const listExist = await listRepository.findListById(listId, userId);
    if(!listExist) throw {type:"not found", message:"list is not found"};

    const movieExist = await movieRepository.findMovieByListId(listId, id);
    if(!movieExist) throw {type:"not found", message:"movie is not found"};

    await movieRepository.deleteMovie(id);
    return;
}

const moviesServices = {
    insertMovie,
    findMoviesByList,
    removeMovie
}

export default moviesServices;