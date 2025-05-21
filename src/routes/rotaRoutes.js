import e from "express";
import errorHandler from "../middlewares/responseHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import RotaController from "../controllers/RotaController.js"; 

const router = e.Router();


router 
  .get("/rotas", authMiddleware, RotaController.listarRotas, errorHandler)
  .post("/rotas", authMiddleware, RotaController.criar, errorHandler)
  .patch("/rotas/:id", authMiddleware, RotaController.atualizar, errorHandler)
  .delete("/rotas/:id", authMiddleware, RotaController.deletar, errorHandler)

export default router;