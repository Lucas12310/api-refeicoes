import e from "express";
import RefeicaoController from "../controllers/RefeicaoController.js";
import PermissoesMiddleware from "../middlewares/permissoesMiddleware.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";


import errorHandler from "../middlewares/responseHandler.js"
const router = e.Router();

router
  .post("/refeicoes", AuthMiddleware, PermissoesMiddleware, RefeicaoController.inserir,errorHandler)
  .get("/refeicoes", AuthMiddleware, PermissoesMiddleware, RefeicaoController.Relatorio,errorHandler);


export default router;
