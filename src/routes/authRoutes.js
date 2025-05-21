import e from "express";
import AuthController from '../controllers/AuthController.js';
import errorHandler from "../middlewares/responseHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import PermissoesController from "../controllers/PermissoesController.js";

const router = e.Router();


router
  .post("/forgot-password", AuthController.forgotPassword, errorHandler)
  .post("/reset-password", authMiddleware, AuthController.resetPassword, errorHandler)
  .post("/login", AuthController.Login, errorHandler)
  .post("/logout", authMiddleware, AuthController.Logout, errorHandler)
  .post("/refresh-token", authMiddleware, AuthController.RefreshToken, errorHandler)
  .post("/revoke-token", authMiddleware, AuthController.RevokeToken, errorHandler)
  .get("/permissoes", authMiddleware, PermissoesController.listarPermissoes, errorHandler)

export default router;