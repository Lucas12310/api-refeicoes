import UsuarioModel from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import PasswordResetCode from "../models/PasswordResetCode.js"
class AuthRepository {
  static async login(email, senha) {
    const usuario = await UsuarioModel.findOne({ email });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      throw {
        code: 401,
        message: "Email ou senha inválidos.",
      };
    }
    if (!usuario.ativo) { throw { code: 403 } }
    const { senha: _, refreshToken, ...usuarioSemSenha } = usuario.toObject();

    return usuarioSemSenha;
  }

  static async updateTokens(userId, refreshToken) {
    await UsuarioModel.findByIdAndUpdate(userId, { refreshToken });
  }

  static async removeTokens(userId) {

    const usuario = await UsuarioModel.findById(userId);

    if (!usuario) {
      throw { code: 404, message: "Usuário não encontrado." };
    }
    if (!usuario.refreshToken) {
      throw { code: 401, message: "Usuário já está sem refresh token." };
    }

    await UsuarioModel.findByIdAndUpdate(userId, { $unset: { refreshToken: "" } });
  }

  static async createResetCode({ email, code, expiresAt }) {
    return await PasswordResetCode.create({ email, code, expiresAt });
  }

  static async findValidResetCode(email, code) {
    return await PasswordResetCode.findOne({
      email,
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  }

  static async markCodeAsUsed(id) {
    return await PasswordResetCode.findByIdAndUpdate(id, { used: true });
  }

}

export default AuthRepository;