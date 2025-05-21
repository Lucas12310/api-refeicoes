import e from "express";
import CursoController from "../controllers/CursoController.js";
import errorHandler from "../middlewares/responseHandler.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import PermissoesMiddleware from "../middlewares/permissoesMiddleware.js";

const router = e.Router();

router
  .get("/cursos", authMiddleware, PermissoesMiddleware, CursoController.listar, errorHandler)
  .post("/cursos", authMiddleware, PermissoesMiddleware, CursoController.inserir, errorHandler)
  .patch("/cursos/:id", authMiddleware, PermissoesMiddleware, CursoController.atualizar, errorHandler)
  .delete("/cursos/:id", authMiddleware, PermissoesMiddleware, CursoController.excluir, errorHandler)
export default router;