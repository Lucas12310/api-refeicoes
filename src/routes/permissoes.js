import e from "express";
import errorHandler from "../middlewares/responseHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import PermissoesController from "../controllers/PermissoesController.js"; 

const router = e.Router();


router 
  .get("/permissoes", authMiddleware, PermissoesController.listarPermissoes, errorHandler)
  .post("/permissoes", authMiddleware, PermissoesController.criar, errorHandler)
  .patch("/permissoes/:id", authMiddleware, PermissoesController.atualizar, errorHandler)
  .delete("/permissoes/:id", authMiddleware, PermissoesController.deletar, errorHandler);

export default router;