import { User } from "@prisma/client";
import {faker} from "@faker-js/faker";
import prisma from "../../src/config/database";

export type CreateUserData = Omit<User, "id" >;

//dados do usuário
function userGenerate(){
    return {
        name: "Super Teste",
        email: `supertest123@gmail.com`,
        password: "teste1234"
    }
}

async function signUp(data:CreateUserData){
    return await prisma.user.create({
        data: data
    });
}






const intFactory = {
    userGenerate,
    signUp
    
}
export default intFactory;