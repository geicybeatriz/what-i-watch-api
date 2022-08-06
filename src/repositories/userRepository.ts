import prisma from "../config/database.js";
import { CreateUserData } from "../services/userServices.js";

async function insert(data:CreateUserData){
    return await prisma.user.create({
        data:data
    });
}

async function findByEmail(email:string){
    return await prisma.user.findFirst({
        where: {
            email:email
        }
    });
}

async function findById(id:number){
    return await prisma.user.findFirst({
        where: {
            id:id
        }
    });
}

const userRepository = {
    insert,
    findByEmail,
    findById
}

export default userRepository;