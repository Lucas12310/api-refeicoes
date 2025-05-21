import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let bancoUrl = process.env.DB_URL;
const debugMode = process.env.DEBUG === "true";

if (process.env.NODE_ENV === "development") {
  bancoUrl = process.env.DB_URL_TEST;
} else if (process.env.NODE_ENV === "production" && !debugMode) {
  bancoUrl = process.env.DB_URL;
} else if (process.env.NODE_ENV === "development" || debugMode) {
  bancoUrl = process.env.DB_URL_TEST;
} else {
  bancoUrl = null;
}

export async function conectarBanco() {
  if (mongoose.connection.readyState === 1) return; // já está conectado

  if (!bancoUrl) {
    throw new Error(
      "Impossível se conectar ao banco de dados. \nÉ necessário configurar a variável de ambiente DB_URL com a string de conexão do banco de dados."
    );
  }

  try {
    await mongoose.connect(bancoUrl);
  } catch (error) {
    console.log("Erro ao conectar com banco " + error);
    throw error; // não iniciar o servidor se não conseguir se conectar com o banco
  }
}

// await conectarBanco();

export default mongoose.connection;
