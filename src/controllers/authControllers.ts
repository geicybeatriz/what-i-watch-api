import { Request, Response } from "express";
import authServices from "../services/userServices.js";


async function signUp(req:Request, res:Response){
    const {name, email, password, confirm_password} = req.body;
    await authServices.createNewUser({name, email, password});
    res.sendStatus(201);
}

async function signIn(req:Request, res:Response){
    const user = await authServices.userLogin(req.body);
    res.status(200).send(user);
}

const authControllers = {
    signUp,
    signIn
}

export default authControllers;