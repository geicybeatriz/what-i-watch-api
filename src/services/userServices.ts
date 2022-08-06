import { User } from "@prisma/client";
import userRepository from "../repositories/userRepository.js";
import * as bcrypt from "bcrypt";

export type CreateUserData = Omit<User, "id">

async function findByEmail(email:string){
    const user = await userRepository.findByEmail(email);
    return user;
}

async function encryptPassword(password:string){
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

async function createNewUser(data:CreateUserData){
    const userExist = await findByEmail(data.email);
    if(userExist) throw {type:"conflict", message:"this user already exist!"};

    const hashPassword = await encryptPassword(data.password);
    await userRepository.insert({...data, password: hashPassword});
    return;
}

const authServices = {
    createNewUser
}

export default authServices;