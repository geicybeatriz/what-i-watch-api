import { Request, Response } from "express";
import listServices from "../services/listServices.js";

async function createList(req:Request, res:Response){
    const {name} = req.body;
    const {userId} = res.locals.userId;
    
    await listServices.createList(name, parseInt(userId));
    res.sendStatus(201);
}

const listControllers = {
    createList
}

export default listControllers;