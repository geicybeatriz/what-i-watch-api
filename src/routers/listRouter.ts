import { Router } from "express";
import listControllers from "../controllers/listController.js";
import validateSchemas from "../middlewares/schemaValidationMiddleware.js";
import tokenValidation from "../middlewares/tokenValidationMiddleware.js";
import moviesSchemas from "../schemas/movieSchema.js";

const listRouter = Router();

listRouter.post("/mylist", tokenValidation, validateSchemas(moviesSchemas.listMovie), listControllers.createList);
listRouter.get("/mylist", tokenValidation, listControllers.getAllList);
listRouter.get("/mylist/:listId", tokenValidation, listControllers.getListById);

export default listRouter;