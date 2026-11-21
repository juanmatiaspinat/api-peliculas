import { Router } from "express";
import * as movieController from "./controller";
import { verifyToken } from "../../middlewares/auth";

const router = Router();

// Rutas públicas (aca cualquiera puede consultar el catálogo)
router.get("/", movieController.getAll);
router.get("/:id", movieController.getById);

// Rutas protegidas (estas requieren JWT)
router.post("/", verifyToken, movieController.create);
router.put("/:id", verifyToken, movieController.update);
router.delete("/:id", verifyToken, movieController.remove);

export default router;
