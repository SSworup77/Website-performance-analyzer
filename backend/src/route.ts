import { Router } from "express";
import { analyse } from "./analyse.controllers";

const router = Router()

router.post('/', analyse)
export default router;