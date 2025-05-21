import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

export default async function usuarioSeed() {

  const salt = Number(process.env.SALT_LENGTH) || 16; //16 é o padrão para produção
  const adminSenhaHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

  const admin = {
    nome: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    senha: adminSenhaHash,
    ativo: true,
    admin: true
  }

  await Usuario.deleteMany({});

  await Usuario.create(admin);

  const usuarioNormalSenhaHash = await bcrypt.hash("SenhaSenhaSenha123", salt);

  const usuarioNormal = {
    nome: "Usuario Teste",
    email: "teste@gmail.com",
    senha: usuarioNormalSenhaHash,
    ativo: true,
    admin: false 
  }

  await Usuario.create(usuarioNormal);
  console.log("Usuários criados com sucesso!");
}