import { User } from "@prisma/client";
import userRepository from "../repositories/userRepository.js";
import * as bcrypt from "bcrypt";
import "./../config/setup.js";
import jwt  from "jsonwebtoken";

export type CreateUserData = Omit<User, "id">
export type LoginUserData = Omit<User, "id"| "name">

async function findByEmail(email:string){
    const user = await userRepository.findByEmail(email);
    return user;
}

async function encryptPassword(password:string){
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

async function matchEncriptedPassword(encriptedPassword:string, password:string){
    const checkData = await bcrypt.compare(password, encriptedPassword);
    if(!checkData) throw {type:"unauthorized", message:"incorrect password"};
    return checkData;
}

function generateToken(userId:number){
    const data = { userId };
    const config = {expiresIn:60*60*24*30};
    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign(data, secretKey, config);
    return token;
}

async function createNewUser(data:CreateUserData){
    const userExist = await findByEmail(data.email);
    if(userExist) throw {type:"conflict", message:"this user already exist!"};

    const hashPassword = await encryptPassword(data.password);
    await userRepository.insert({...data, password: hashPassword});
    return;
}

async function userLogin(data:LoginUserData){
    const userExist = await findByEmail(data.email);
    if(!userExist) throw {type:"not found", message:"user is not found"}

    await matchEncriptedPassword(userExist.password, data.password);
    const token = generateToken(userExist.id);
    return token;
}

const authServices = {
    createNewUser,
    userLogin
}

export default authServices;