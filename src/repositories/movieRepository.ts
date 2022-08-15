import prisma from "../config/database.js";
import { CreateMovieData } from "../services/listServices.js";

async function insert(data: CreateMovieData){
    return await prisma.movie.create({
        data: data
    });
}

async function findAllMoviesByListId(listId:number){
    return await prisma.movie.findMany({
        where:{listId}
    })
}

async function findMovieByListId(listId:number, id:number){
    return await prisma.movie.findFirst({
        where:{id, listId}
    });
}

async function deleteMovie(id:number){
    return await prisma.movie.delete({
        where:{
            id
        }
    })
}

const movieRepository = {
    findAllMoviesByListId,
    insert,
    deleteMovie,
    findMovieByListId
}

export default movieRepository;