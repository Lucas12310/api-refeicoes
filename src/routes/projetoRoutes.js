import e from "express";
import ProjetoController from "../controllers/ProjetoController.js";
import errorHandler from "../middlewares/responseHandler.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import PermissoesMiddleware from "../middlewares/permissoesMiddleware.js";

const router = e.Router();

router
  .get("/projetos", authMiddleware, PermissoesMiddleware, ProjetoController.listar, errorHandler)
  .post("/projetos", authMiddleware, PermissoesMiddleware, ProjetoController.inserir, errorHandler)
  .patch("/projetos/:id", authMiddleware, PermissoesMiddleware, ProjetoController.atualizar, errorHandler)
  .delete("/projetos/:id", authMiddleware, PermissoesMiddleware, ProjetoController.excluir, errorHandler);

export default router;
