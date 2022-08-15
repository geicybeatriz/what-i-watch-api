import { Request, Response } from "express";
import listRepository from "../repositories/listRepository.js";
import listServices from "../services/listServices.js";

async function createList(req:Request, res:Response){
    const {name} = req.body;
    const {userId} = res.locals.userId;

    await listServices.createList(name, parseInt(userId));
    res.sendStatus(201);
}

async function getAllList(req:Request, res:Response){
    const {userId} = res.locals.userId;

    const lists = await listServices.findAllLists(parseInt(userId));
    res.status(200).send(lists);
}

async function getListById(req:Request, res:Response){
    const {userId} = res.locals.userId;
    const id = +req.params.listId;

    const list = await listServices.findListById(parseInt(userId), id)
    res.status(200).send(list);
}

const listControllers = {
    createList,
    getAllList,
    getListById
}

export default listControllers;