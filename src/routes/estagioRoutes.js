import e from "express";
import EstagioController from "../controllers/EstagioController.js";
import errorHandler from "../middlewares/responseHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import PermissoesMiddleware from "../middlewares/permissoesMiddleware.js";

const router = e.Router();

router
  .get("/estagios", authMiddleware, PermissoesMiddleware, EstagioController.ListarEstagios, errorHandler)
  .post("/estagios", authMiddleware, PermissoesMiddleware, EstagioController.AdicionarEstagio, errorHandler)
  .get("/estagios/:id", authMiddleware, PermissoesMiddleware, EstagioController.ListarEstagioPorId, errorHandler)
  .put("/estagios/:id", authMiddleware, PermissoesMiddleware, EstagioController.AtualizarEstagio, errorHandler)
  .delete("/estagios/:id", authMiddleware, PermissoesMiddleware, EstagioController.DeletarEstagio, errorHandler);

export default router;