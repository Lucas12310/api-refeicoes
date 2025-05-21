import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
let token
let estudanteInformation
const estudante_faker = faker.person.fullName();
const matricula_faker = faker.string.numeric(13);
let turmaValida
let cursoValido
let estudantecadastrado

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
  
  const turma = await request(app)
    .get("/turmas")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${token}`);
  expect(turma.status).toBe(200);
  turmaValida = turma.body.data.data[0]._id

  const curso = await request(app)
    .get("/cursos")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${token}`);
  expect(turma.status).toBe(200);
  cursoValido = curso.body.data.data[0]._id

}, 15000);//Coloquei 15 segundos de espera, pois por algum motivo o logar implementedo nessa api demora DEMAIIIIIIIIIIIIIIS

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Listar estudantes GET/", () => {
  describe("Caminho feliz", () => {
    it("Deve listar todos os estudantes com sucesso", async () => {
      const response = await request(app)
        .get("/estudantes")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      estudanteInformation = response.body.data.data[0]
    });
    it("deve listar um estudante com base no nome", async () => {
      const response = await request(app)
        .get(`/estudantes?nome=${estudanteInformation.nome}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar um estudante com base na turma", async () => {
      const response = await request(app)
        .get(`/estudantes?turma=${estudanteInformation.turma._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar um estudante com base na matrícula", async () => {
      const response = await request(app)
        .get(`/estudantes?matricula=${estudanteInformation.matricula}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar um estudante com base no status", async () => {
      const response = await request(app)
        .get(`/estudantes?ativo=${estudanteInformation.ativo}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar os estudantes da próxima página", async () => {
      const response = await request(app)
        .get(`/estudantes?pagina=2`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  })
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar um estudante com status inválido", async () => {
      const response = await request(app)
        .get(`/estudantes?ativo=asd`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "ativo",
            message: "O campo 'ativo' deve ser 'true' ou 'false'.",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um estudante com matrícula menor que 13 caracteres", async () => {
      const response = await request(app)
        .get(`/estudantes?matricula=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "matricula",
            message: "Matrícula deve ter no mínimo 13 caracteres",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um estudante com matrícula maior que 18 caracteres", async () => {
      const response = await request(app)
        .get(`/estudantes?matricula=12312321312313131312321123123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "matricula",
            message: "Matrícula deve ter no máximo 18 caracteres",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um estudante com uma matrícula não existente.", async () => {
      const response = await request(app)
        .get(`/estudantes?matricula=12312313221313`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
    it("deve retornar erro ao tentar listar um estudante com nome com apenas números", async () => {
      const response = await request(app)
        .get(`/estudantes?nome=12312313212`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "nome",
            message: "O nome precisa ser em palavras e não números.",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um estudante com um nome não existente.", async () => {
      const response = await request(app)
        .get(`/estudantes?nome=filipiiiino`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
    it("deve retornar erro ao tentar listar um estudante com uma turma no formato inválido.", async () => {
      const response = await request(app)
        .get(`/estudantes?turma=123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "turma",
            message: "O campo 'turma' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar um estudante com uma turma não existente", async () => {
      const response = await request(app)
        .get(`/estudantes?turma=67f941218ec90b300c697c77`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
  });
});
describe("Listar estudantes GET/:ID", () => {
  describe("Caminho feliz", () => {
    it("Deve listar todos os estudantes com sucesso", async () => {

      const response = await request(app)
        .get(`/estudantes/${estudanteInformation._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar um estudante com um id não existente", async () => {
      const response = await request(app)
        .get(`/estudantes/67fe791a879e5fc0cd3f2b76`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("Estudante não encontrado");
    });
    it("deve retornar erro ao tentar listar um estudante com um id no formato inválido.", async () => {
      const response = await request(app)
        .get(`/estudantes/123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "id",
            message: "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).",
          }),
        ])
      );
    });
  });
});

describe("Cadastrar estudantes POST/", () => {
  describe("Caminho feliz", () => {
    it("deve cadastrar um estudante", async () => {
      const response = await request(app)
        .post("/estudantes")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: turmaValida,
          curso: cursoValido,
          ativo: true,
        });
        
      expect(response.status).toBe(201);
      estudantecadastrado = response.body.data
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar um estudante com a matrícula já existente", async () => {
      const response = await request(app)
        .post("/estudantes")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: turmaValida,
          curso: cursoValido,
          ativo: true,
        });
      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("matricula");
    });
    it("deve retornar erro ao tentar cadastrar um estudante com uma turma inexistente", async () => {
      const response = await request(app)
        .post("/estudantes")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: "67fe7919879e77c0cd3f2dff",
          curso: cursoValido,
          ativo: true,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("turma");
    });
  });
});

describe("Atualizar estudantes PUT/:ID", () => {
  let data;
  describe("Caminho feliz", () => {
    it("deve atualizar um estudante", async () => {
      const matricula_faker_att = faker.string.numeric(13);
      const response = await request(app)
        .put(`/estudantes/${estudantecadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker_att,
          turma: turmaValida,
          ativo: false,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.nome).toEqual(estudante_faker);
      expect(response.body.data.matricula).toEqual(matricula_faker_att);
      expect(response.body.data.ativo).toEqual(false);
      data = response.body.data
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar um estudante com a matrícula já existente", async () => {
      const response = await request(app)
        .put(`/estudantes/${estudantecadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: data.nome,
          matricula: data.matricula,
          turma: data.turma._id,
          ativo: data.ativo,
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("Dados iguais aos presentes no banco de dados");
    });
    it("deve retornar erro ao tentar atualizar um estudante com uma turma inexistente",
      async () => {
        const response = await request(app)
          .put(`/estudantes/${estudantecadastrado._id}`)
          .set("Content-Type", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send({
            nome: estudante_faker,
            matricula: matricula_faker,
            turma: "67fe7919879e77c0cd3f2dff",
            ativo: true,
          });
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("turma");
      });
    it("deve retornar erro ao tentar atualizar um estudante com um id não existente", async () => {
      const response = await request(app)
        .put(`/estudantes/67fe7919879e77c0cd3f2dff`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: turmaValida,
          ativo: true,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("Estudante não encontrado");
    });
  });
});

describe("Deletar estudantes DELETE/:ID", () => {
  describe("Caminho feliz", () => {
    it("deve deletar um estudante", async () => {
      const response = await request(app)
        .delete(`/estudantes/${estudantecadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Requisição bem-sucedida");
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar um estudante com um id não existente", async () => {
      const response = await request(app)
        .delete(`/estudantes/${estudantecadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
  });
});

describe("Inativar estudantes PATCH/:ID", () => {
  describe("Caminho feliz", () => {
    it("deve ativar um estudante cadastrando um novo para o próximo teste funcionar", async () => {
      const response = await request(app)
        .post("/estudantes")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: estudante_faker,
          matricula: matricula_faker,
          turma: turmaValida,
          curso: cursoValido,
          ativo: true,
        });
      expect(response.status).toBe(201);
      estudantecadastrado = response.body.data
    });
    it("deve inativar TODOS OS ESTUDANTES ATIVOS", async () => {
      const response = await request(app)
        .patch(`/estudantes/inativar`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          confirmacao: true,
        });
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Requisição bem sucedida.");
    });
  });
  describe("Caminho triste", () => {
    it("deve dar erro ao tentar inativar todos os estudantes.", async () => {
      const response = await request(app)
        .patch(`/estudantes/inativar`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          confirmacao: true,
        });
      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("Todos os estudantes já estão inativos.");
    });
  });
});