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

const movieRepository = {
    findAllMoviesByListId,
    insert
}

export default movieRepository;