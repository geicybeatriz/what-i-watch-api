import { Request, Response, NextFunction } from "express";
import authServices from "../services/userServices.js";

export default async function tokenValidation(req:Request, res:Response, next:NextFunction){
    const {authorization} = req.headers;
    if(!authorization) throw {type:"unauthorized", message:"access denied"};

    const token = authorization?.replace('Bearer ', '');
    if(!token) throw {type:"unauthorized", message:"unauthorized token"};

    const verifyToken = authServices.verifyToken(token);
    res.locals.userId = verifyToken;

    next();
}