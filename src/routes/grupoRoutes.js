import e from "express";
import errorHandler from "../middlewares/responseHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import GrupoController from "../controllers/GrupoController.js"; 

const router = e.Router();


router 
  .get("/grupos", authMiddleware, GrupoController.listarGrupos, errorHandler)
  .post("/grupos", authMiddleware, GrupoController.criar, errorHandler)
  .delete("/grupos/:id", authMiddleware, GrupoController.deletar, errorHandler)
  .patch("/grupos/:id", authMiddleware, GrupoController.atualizar, errorHandler)

export default router;