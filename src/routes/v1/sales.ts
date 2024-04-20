import { Router } from "express";
import { createSale, getSales } from "../../controllers/sales";
import useAuth from "../../middlewares/auth";
import { adminOnly } from "../../middlewares/authorize";
import validateIdParam from "../../middlewares/validateIdParam";

const router = Router()

router.post("/:id", useAuth, adminOnly, validateIdParam,createSale)
router.get("/", useAuth, adminOnly, getSales)


export default router