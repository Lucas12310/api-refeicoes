import request from "supertest";
import { expect, it, describe, beforeAll, afterAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

let token;
let grupoCadastrado;

beforeAll(async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: "admin@gmail.com",
      senha: "Admin123@abc",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Listar grupos GET/", () => {
  it("Deve listar todos os grupos com sucesso", async () => {
    const response = await request(app)
      .get("/grupos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.error).toBe(false);
  });
  it("deve retornar erro ao tentar listar um grupo com um nome no formato errado.", async () => {
    const response = await request(app)
      .get(`/grupos?nome=123`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveProperty("code", 400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "nome",
          message: "O nome precisa ser em palavras e não em números.",
        }),
      ])
    );
  });
});

describe("Cadastrar grupos POST/", () => {
  it("Deve cadastrar um grupo com sucesso", async () => {
    const dadosGrupo = {
      nome: faker.lorem.word(),
      descricao: faker.lorem.sentence(),
    };

    const response = await request(app)
      .post("/grupos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(dadosGrupo);

    expect(response.status).toBe(201);
    grupoCadastrado = response.body.data;
  });

  it("Deve retornar erro ao tentar cadastrar um grupo com os mesmos dados já existentes", async () => {
    const response = await request(app)
      .post("/grupos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(grupoCadastrado);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("A requisição do cliente em conflito com o estado atual do servidor.");
  });
});

describe("Atualizar grupos PATCH/:id", () => {
  it("Deve atualizar um grupo com sucesso", async () => {
    const novosDados = {
      nome: "Nome atualizado",
      descricao: "Descrição atualizada",
    };

    const response = await request(app)
      .patch(`/grupos/${grupoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(novosDados);

    expect(response.status).toBe(200);
  });

  it("Deve retornar erro ao tentar atualizar um grupo com um ID inexistente", async () => {
    const response = await request(app)
      .patch(`/grupos/67fe721a879e5fc0cd3f2b76`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Nome inválido" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("O recurso solicitado não foi encontrado no servidor.");
  });
});

describe("Deletar grupos DELETE/:id", () => {
  it("Deve deletar um grupo com sucesso", async () => {
    const response = await request(app)
      .delete(`/grupos/${grupoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("Deve retornar erro ao tentar deletar um grupo com um ID inexistente", async () => {
    const response = await request(app)
      .delete(`/grupos/67fe721a879e5fc0cd3f2b76`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("O recurso solicitado não foi encontrado no servidor.");
  });
});
