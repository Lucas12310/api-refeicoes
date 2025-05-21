import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
let token
let cursoValido = ""
let codigo_suap_faker_int = faker.number.int({ min: 1, max: 10000 });
let codigo_suap_faker = codigo_suap_faker_int.toString();
const curso_faker = faker.commerce.department();
let cursoCadastrado = ""

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

describe("Listar Cursos", () => {
  it("deve listar todos os cursos sucesso", async () => {
    const response = await request(app)
      .get("/cursos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    cursoValido = response.body.data.data[0]
  });
  it("deve listar um curso com base no id", async () => {
    const response = await request(app)
      .get(`/cursos?id=${cursoValido._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it("deve listar um curso com base no nome", async () => {
    const response = await request(app)
      .get(`/cursos?nome=${cursoValido.nome}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it("deve listar um curso com base no codigo_suap", async () => {
    const response = await request(app)
      .get(`/cursos?codigo_suap=${cursoValido.codigo_suap}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});

describe("Cadastrar Curso", () => {
  it("deve cadastrar um curso", async () => {
    const response = await request(app)
      .post("/cursos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: curso_faker,
        contra_turnos: {
          segunda: false,
          terca: true,
          quarta: false,
          quinta: false,
          sexta: false,
          sabado: false,
          domingo: false
        },
        codigo_suap: codigo_suap_faker
      });
    expect(response.status).toBe(201);
    cursoCadastrado = response.body.data
  });
  it("deve retornar erro se não passar os parametros", async () => {
    const response = await request(app)
      .post("/cursos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(response.status).toBe(400);
  });
  it("deve retornar erro ao tentar cadastrar curso com codigo invalido", async () => {
    const response = await request(app)
      .post("/cursos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: curso_faker,
        contra_turnos: {
          segunda: false,
          terca: true,
          quarta: false,
          quinta: false,
          sexta: false,
          sabado: false,
          domingo: false
        },
        codigo_suap: 123
      });
    expect(response.status).toBe(400);
  });
  it("deve retornar erro ao tentar cadastrar curso com nome invalido", async () => {
    const response = await request(app)
      .post("/cursos")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: 123,
        contra_turnos: {
          segunda: false,
          terca: true,
          quarta: false,
          quinta: false,
          sexta: false,
          sabado: false,
          domingo: false
        },
        codigo_suap: codigo_suap_faker
      });
    expect(response.status).toBe(400);
  });
});

describe("Deve Alterar as informações de um curso", () => {
  it("deve alterar o nome do curso", async () => {
    const response = await request(app)
      .patch(`/cursos/${cursoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: curso_faker
      });
    expect(response.status).toBe(200);
  });
  it("deve alterar o codigo do curso", async () => {
    const response = await request(app)
      .patch(`/cursos/${cursoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        codigo_suap: codigo_suap_faker + 1
      });
    expect(response.status).toBe(200);
  });
});

describe("Deve excluir um curso", () => {
  it("deve excluir o curso", async () => {
    const response = await request(app)
      .delete(`/cursos/${cursoCadastrado._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(204);
  });
});