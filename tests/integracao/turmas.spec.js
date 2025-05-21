import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
let token
let turmaValida = ""
let codigo_suap_faker_int = faker.number.int({ min: 1, max: 10000 });
let codigo_suap_faker = codigo_suap_faker_int.toString();
const turma_faker = faker.commerce.department();
let turmaCadastrada = ""
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


describe("Listar turmas", () => {
  it("deve listar todos os cursos sucesso", async () => {
    const response = await request(app)
      .get("/turmas")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    turmaValida = response.body.data.data[0]
  });
  it("deve listar um curso com base no id", async () => {
    const response = await request(app)
      .get(`/turmas?id=${turmaValida._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it("deve listar um curso com base na descricao", async () => {
    const response = await request(app)
      .get(`/turmas?nome=${turmaValida.descricao}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it("deve listar um curso com base no codigo_suap", async () => {
    const response = await request(app)
      .get(`/turmas?codigo_suap=${turmaValida.codigo_suap}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
describe("Cadastrar turmas", () => {
  it("deve cadastrar uma turma", async () => {
    const response = await request(app)
      .post("/turmas")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        codigo_suap: "20251.1.0302.1A",
        descricao: "fisioterapia 1A",
        curso: "67f4a91c56de274185ac07ed"
      });
    expect(response.status).toBe(201);
    turmaCadastrada = response.body.data
  });
  it("deve retornar erro ao tentar cadastrar turma com dados invalidos", async () => {
    const response = await request(app)
      .post("/turmas")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        codigo_suap: 123,
        descricao: "fisioterapia 1A",
        curso: "67f4a91c56de274185ac07ed"
      });
    expect(response.status).toBe(400);
  });
});

describe("Deve Alterar as informações de uma turma", () => {
  it("deve alterar o nome da turma", async () => {
    const response = await request(app)
      .patch(`/turmas/${turmaCadastrada._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: turma_faker + " 1B"
      });
    expect(response.status).toBe(200);
  });
});

describe("deletar turmas", () => {
  it("deve caddeletar uma turma", async () => {
    const response = await request(app)
      .delete(`/turmas/${turmaCadastrada._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(204);
  });
});