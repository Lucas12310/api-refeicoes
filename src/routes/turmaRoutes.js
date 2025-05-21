import e from "express";
import TurmaController from "../controllers/TurmaController.js";
import errorHandler from "../middlewares/responseHandler.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import PermissoesMiddleware from "../middlewares/permissoesMiddleware.js";

const router = e.Router();

router
  .get("/turmas", authMiddleware, PermissoesMiddleware, TurmaController.listar, errorHandler)
  .post("/turmas", authMiddleware, PermissoesMiddleware, TurmaController.inserir, errorHandler)
  .patch("/turmas/:id", authMiddleware, PermissoesMiddleware, TurmaController.atualizar, errorHandler)
  .delete("/turmas/:id", authMiddleware, PermissoesMiddleware, TurmaController.excluir, errorHandler);

export default router;
