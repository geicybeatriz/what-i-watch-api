import { Router } from "express";
import authControllers from "../controllers/authControllers.js";
import validateSchemas from "../middlewares/schemaValidationMiddleware.js";
import authSchemas from "../schemas/authSchema.js";

const authRouter = Router();

authRouter.post("/sign-up", validateSchemas(authSchemas.signUpSchema), authControllers.signUp);
authRouter.post("/sign-in", validateSchemas(authSchemas.signInSchema), authControllers.signIn);

export default authRouter;