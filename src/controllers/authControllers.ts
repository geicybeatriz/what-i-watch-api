import { Request, Response } from "express";
import authServices from "../services/userServices.js";


async function signUp(req:Request, res:Response){
    const {name, email, password, confirm_password} = req.body;
    await authServices.createNewUser({name, email, password});
    res.sendStatus(201);
}

const authControllers = {
    signUp
}

export default authControllers;