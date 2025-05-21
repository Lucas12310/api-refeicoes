import request from "supertest";
import { expect, it, describe, beforeAll, afterAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";

let token;
let refreshTokenReq;
let userIdValido;

beforeAll(async () => {
  // Criar um usuário válido para os testes (se necessário)
  const response = await request(app)
    .post("/login")
    .send({
      email: "admin@gmail.com",
      senha: "Admin123@abc",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;
  refreshTokenReq = response.body.data.refreshToken;
  userIdValido = response.body.data.usuario._id;
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Autenticação - Login POST/", () => {
  describe("Caminho feliz", () => {
    it("Deve realizar login com sucesso", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: "admin@gmail.com",
          senha: "Admin123@abc",
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
    }, 15000);
  });

  describe("Caminho triste", () => {
    it("Deve retornar erro ao tentar logar com email inválido", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: "asdasdad",
          senha: "Admin123@abc",
        });
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "email",
            message: "Email invalido",
          }),
        ])
      );
    });
    it("Deve retornar erro ao tentar logar com senha inválida", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: "admin@gmail.com",
          senha: "senha",
        });
      expect(response.body.message).toEqual("Email ou senha inválidos.");
    }, 15000);

    it("Deve retornar erro ao tentar logar com campos vazios", async () => {
      const response = await request(app)
        .post("/login")
        .send({});
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "email",
            message: "Required",
          }),
          expect.objectContaining({
            path: "senha",
            message: "Required",
          }),
        ])
      );
    });
  });
});

describe("Autenticação - Logout POST/", () => {
  describe("Caminho feliz", () => {
    it("Deve realizar logout com sucesso", async () => {
      const response = await request(app)
        .post("/logout")
        .send({ userId: userIdValido })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe("Logout realizado com sucesso.");
    });
  });

  describe("Caminho triste", () => {
    it("Deve retornar erro ao tentar realizar logout sem userId", async () => {
      const response = await request(app)
        .post("/logout")
        .send({})
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("ID do usuário é obrigatório.");
    });
    it("Deve retornar erro ao tentar realizar logout com userId inválido", async () => {
      const response = await request(app)
        .post("/logout")
        .send({ userId: "uajsiuugudaudguagd" })
        .set("Authorization", `Bearer ${token}`);

      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "userId",
            message: "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).",
          }),
        ])
      );
    });
  });
});
