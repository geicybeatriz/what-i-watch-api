import prisma from "../config/database.js";
import { CreateMovieListData } from "../services/listServices.js";

async function createList(data: CreateMovieListData){
    return await prisma.movies_list.create({
        data: data
    });
}

async function findAllLists(userId:number){
    return await prisma.movies_list.findMany({
        where: {userId:userId}
    });
}

async function findListByName(name:string, userId:number){
    return await prisma.movies_list.findFirst({
        where: {name, userId}
    });
}

async function findListById(id:number, userId:number){
    return await prisma.movies_list.findFirst({
        where: {
            id, userId
        }
    });
}

const listRepository = {
    createList,
    findAllLists,
    findListByName,
    findListById
}

export default listRepository;