import e from"express";
import RefeicaoTurmaController from "../controllers/RefeicaoTurmaController.js";
import errorHandler from "../middlewares/responseHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import PermissoesMiddleware from "../middlewares/permissoesMiddleware.js";

const router =  e.Router();

router
  .get("/refeicoes-turmas", authMiddleware, PermissoesMiddleware, RefeicaoTurmaController.listarRefeicoesTurma, errorHandler)
  .post("/refeicoes-turmas", authMiddleware, PermissoesMiddleware, RefeicaoTurmaController.adicionarRefeicaoTurma, errorHandler)
  .get("/refeicoes-turmas/:id", authMiddleware, PermissoesMiddleware, RefeicaoTurmaController.listarRefeicaoTurmaPorId, errorHandler)
  .put("/refeicoes-turmas/:id", authMiddleware, PermissoesMiddleware, RefeicaoTurmaController.atualizarRefeicaoTurma, errorHandler)
  .delete("/refeicoes-turmas/:id", authMiddleware, PermissoesMiddleware, RefeicaoTurmaController.deletarRefeicaoTurma, errorHandler);

export default router;