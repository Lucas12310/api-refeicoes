import jwt from "jsonwebtoken";
import AuthSchema from "../schemas/authSchema.js";
import AuthRepository from "../repository/AuthRepository.js";
import UsuarioRepository from "../repository/UsuarioRepository.js";
import { generateResetCode } from "../utils/generateResetCode.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

class AuthService {
  static async login(data) {
    const { email, senha } = AuthSchema.login.parse(data);
    if (!email || !senha) {
      throw {
        code: 400,
        message: "Email e senha são obrigatórios.",
      }
    }
    const usuario = await AuthRepository.login(email, senha);

    const accessTokenExpiration = process.env.JWT_EXPIRATION_ACCESS_TOKEN || "15m";
    const refreshTokenExpiration = process.env.JWT_EXPIRATION_REFRESH_TOKEN || "7d";

    const accessToken = jwt.sign(
      {
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        ativo: usuario.ativo,
        grupo: usuario.grupo,
      },
      process.env.JWT_SECRET,
      { expiresIn: accessTokenExpiration }
    );

    const refreshToken = jwt.sign(
      {
        _id: usuario._id,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: refreshTokenExpiration }
    );

    await AuthRepository.updateTokens(usuario._id, refreshToken);

    usuario.senha = undefined;

    return { accessToken, refreshToken, usuario };
  }

  static async logout(userId) {
    if (!userId) {
      throw { code: 400, message: "ID do usuário é obrigatório." };
    }
    const usuario = AuthSchema.logout.parse({ userId });

    await AuthRepository.removeTokens(usuario.userId);
  }

  static async refreshTokens(refreshToken) {
    if (!refreshToken) {
      return res.status(400).json(CommonResponse.badRequest("Refresh token é obrigatório."));
    }
    const refreshTokenValido = AuthSchema.refreshTokens.parse({ refreshToken });
    const decoded = jwt.verify(refreshTokenValido.refreshToken, process.env.JWT_SECRET);

    const usuario = await UsuarioRepository.findById(decoded._id);
    if (!usuario || usuario.refreshToken !== refreshTokenValido.refreshToken) {
      throw { code: 401, message: "Refresh token inválido." };
    }

    const accessTokenExpiration = process.env.JWT_EXPIRATION_ACCESS_TOKEN || "15m";
    const newAccessToken = jwt.sign(
      {
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        ativo: usuario.ativo,
        grupo: usuario.grupo,
      },
      process.env.JWT_SECRET,
      { expiresIn: accessTokenExpiration }
    );

    return { accessToken: newAccessToken };
  }

  static async revokeToken(userId) {
    if (!userId) {
      throw { code: 400, message: "ID do usuário é obrigatório." };
    }

    const usuario = AuthSchema.logout.parse({ userId });

    await AuthRepository.removeTokens(usuario.userId);
  }
  static async forgotPassword(email) {
    const user = await UsuarioRepository.findByEmail(email);
    if (!user) throw { code: 404, message: "Email não encontrado." };
    const code = generateResetCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);// Definido para 10 minutos
    await AuthRepository.createResetCode({ email, code, expiresAt });
    const subject = "Password reset code";
    const message = `
        <h1>Sistema de refeições</h1>
        <h2>Recuperação de senha</h2>
        <h3>Olá, ${user.nome}!</h3>
        <p>Seu código: ${code}</p>`;
    await sendEmail(user.email, subject, message);
    return;
  }

  static async resetPassword(email, code, password) {
    const resetCode = await AuthRepository.findValidResetCode(email, code);

    if (!resetCode) throw { code: 400, message: "Código inválido ou expirado." };

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
    const user = await UsuarioRepository.findByEmail(email);

    if (!user) throw { code: 404, message: "Email não encontrado." };

    const updatedUser = await UsuarioRepository.updateUserPassword(user._id, hashedPassword);
    
    await AuthRepository.markCodeAsUsed(resetCode._id);
    return updatedUser;
  }
}

export default AuthService;