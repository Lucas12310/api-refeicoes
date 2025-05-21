import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
let token
let projetoValido = ""
const projeto_faker = "Projeto " + faker.commerce.department();
let projetoCadastrado = ""

// Coloquei isso para conseguir obter o token antes de rodar todos os testes...
beforeAll(async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: "admin@gmail.com",
      senha: "Admin123@abc",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;
}, 15000);//Coloquei 15 segundos de espera, pois por algum motivo o logar implementedo nessa api demora DEMAIIIIIIIIIIIIIIS

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Listar projetos", () => {
  it("deve listar todos os projetos sucesso", async () => {
    const response = await request(app)
      .get("/projetos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.error).toBe(false);
    projetoValido = response.body.data.data[0]
  });
  it("deve listar um projeto com base no id", async () => {
    const response = await request(app)
      .get(`/projetos?id=${projetoValido._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.error).toBe(false);
  });
  it("deve listar um projeto com base no nome", async () => {
    const response = await request(app)
      .get(`/projetos?nome=${projetoValido.nome}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.error).toBe(false);   
  });
});

describe("Cadastrar Projeto", () => {
  it("deve cadastrar um projeto", async () => {
    const response = await request(app)
      .post("/projetos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        estudantes: [
          "947236894615",
          "327405933772"
        ],
        nome: projeto_faker,
        data_inicio: "2026-08-01",
        data_termino: "2026-12-01",
        status: "Encerrado",
        turnos: {
          segunda: false,
          terca: true,
          quarta: false,
          quinta: false,
          sexta: false,
          sabado: false,
          domingo: false
        }
      });
    expect(response.status).toBe(201);
    expect(response.error).toBe(false); 
    projetoCadastrado = response.body.data
  });
  it("deve retornar erro ao tentar cadastrar um projeto com dados invalidos", async () => {
    const response = await request(app)
      .post("/projetos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        estudantes: [
          "947236894615",
          "327405933772"
        ],
        nome: projeto_faker,
        data_inicio: "2026-08-01",
        data_termino: "2026-12-01",
        status: "Encerrado",
        turnos: {
          segunda: 123,
          terca: true,
          quarta: false,
          quinta: false,
          sexta: false,
          sabado: false,
          domingo: false
        }
      });
    expect(response.status).toBe(400);
  });
});
describe("Alterar Projeto", () => {
  it("deve alterar um projeto", async () => {
    const response = await request(app)
      .patch(`/projetos/${projetoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "Encerrado",
        name: projeto_faker+" FIC"
      });
    expect(response.status).toBe(200);
    expect(response.error).toBe(false); 
  });
});
describe("Excluir Projeto", () => {
  it("deve excluir um projeto", async () => {
    const response = await request(app)
      .delete(`/projetos/${projetoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(204);
  });
  it("deve retornar erro ao tentar excluir um projeto", async () => {
    const response = await request(app)
      .delete(`/projetos/${projetoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true); 
    expect(response.body.message).toBe("Projeto não encontrado!"); 
  });
  it("deve alterar um projeto", async () => {
    const response = await request(app)
      .patch(`/projetos/${projetoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "Encerrado",
        name: projeto_faker+" FIC"
      });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true); 
    expect(response.body.message).toBe("Projeto não encontrado!"); 
  });
});