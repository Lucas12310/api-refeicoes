import e from "express";
import EstudanteController from '../controllers/EstudanteController.js';
import errorHandler from "../middlewares/responseHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authPermission from "../middlewares/permissoesMiddleware.js";

const router = e.Router();

router
  .get("/estudantes", authMiddleware, authPermission, EstudanteController.ListarEstudantes, errorHandler)
  .post("/estudantes", authMiddleware, authPermission, EstudanteController.AdicionarEstudante, errorHandler)
  .put("/estudantes/:id", authMiddleware, authPermission, EstudanteController.AtualizarEstudante, errorHandler)
  .get("/estudantes/:id", authMiddleware, authPermission, EstudanteController.ListarEstudantePorId, errorHandler)
  .delete("/estudantes/:id", authMiddleware, authPermission, EstudanteController.DeletarEstudante, errorHandler)
  .patch("/estudantes/inativar", authMiddleware, authPermission, EstudanteController.InativarEstudantes, errorHandler)

export default router;
