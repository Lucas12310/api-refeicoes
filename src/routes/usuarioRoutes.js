import e from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorHandler from "../middlewares/responseHandler.js";
import PermissoesMiddleware from "../middlewares/permissoesMiddleware.js";

const router = e.Router();

router
  
  .post("/usuarios", authMiddleware, PermissoesMiddleware, UsuarioController.CadastrarUsuario, errorHandler)
  .get("/usuarios", authMiddleware, PermissoesMiddleware, UsuarioController.ListarUsuarios, errorHandler)
  .get("/usuarios/:id", authMiddleware, PermissoesMiddleware,UsuarioController.ListarUsuarioPorId, errorHandler)
  .put("/usuarios/:id", authMiddleware, PermissoesMiddleware, UsuarioController.AtualizarUsuario, errorHandler)
  .delete("/usuarios/:id", authMiddleware, PermissoesMiddleware, UsuarioController.DeletarUsuario, errorHandler);

export default router;
