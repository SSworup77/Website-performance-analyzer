import { Router } from "express";
import { analyse } from "./analyse.controllers";

const router = Router()

router.get('/', analyse)
export default router;