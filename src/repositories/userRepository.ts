import prisma from "../config/database.js";

async function insert(data:any){
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