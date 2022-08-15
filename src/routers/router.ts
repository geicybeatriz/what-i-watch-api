import { Router } from "express";
import authRouter from "./authRouter.js";
import listRouter from "./listRouter.js";
import moviesRouter from "./moviesRouter.js";

const router = Router();

router.use(authRouter);
router.use(listRouter);
router.use(moviesRouter);

export default router;