import { Movie, movies_list } from "@prisma/client";
import listRepository from "./../repositories/listRepository.js";
import userRepository from "./../repositories/userRepository.js"

export type CreateMovieData = Omit<Movie, "id" | "createdAt">;
export type CreateMovieListData = Omit<movies_list, "id" | "createdAt">;

async function findUserById(id:number){
    const user = await userRepository.findById(id);
    if(!user) throw {type:"not found", message:"user is not found"};
    return user;
}

async function createList(name:string, userId:number ){
    await findUserById(userId);

    const list = await listRepository.findListByName(name, userId);
    if(list) throw {type:"conflict", message:"this list already exist!"};

    await listRepository.createList({name:name, userId:userId});
    return;
}

async function findAllLists(userId:number){
    await findUserById(userId);
    const lists = await listRepository.findAllLists(userId);
    return lists;
}

async function findListById(userId:number, id:number){
    await findUserById(userId);
    const list = await listRepository.findListById(id, userId);
    if(!list) throw {type:"not found", message:"list is not found"};
    return list;
}

const listServices = {
    createList,
    findUserById,
    findAllLists,
    findListById
}

export default listServices;