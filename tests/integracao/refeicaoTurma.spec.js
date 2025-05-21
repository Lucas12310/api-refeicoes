import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
let token
let refeicaoTurmaInformation
const dataFaker = faker.date.recent().toISOString()

// const matricula_faker = faker.string.numeric(13);
let turmaValida
let RefeicaoTurmaCadastrada

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

}, 15000);//Coloquei 15 segundos de espera, pois por algum motivo o logar implementedo nessa api demora DEMAIIIIIIIIIIIIIIS

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Listar refeições por turma GET/", () => {
  describe("Caminho feliz", () => {
    it("Deve listar todas as refeições por turma com sucesso", async () => {
      const response = await request(app)
        .get("/refeicoes-turmas")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      refeicaoTurmaInformation = response.body.data.data[0]
    });
    it("deve listar refeições por turmas com base no id da turma", async () => {
      const response = await request(app)
        .get(`/refeicoes-turmas?turma=${refeicaoTurmaInformation.turma._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar refeições por turmas com base na descrição", async () => {
      const response = await request(app)
        .get(`/refeicoes-turmas?descricao=${refeicaoTurmaInformation.descricao}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar refeições por turmas com o id da turma errado", async () => {
      const response = await request(app)
        .get(`/refeicoes-turmas?turma=asdadasdasd`)
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
    it("deve retornar erro ao tentar listar refeições por turmas com um id de uma turma inexistente", async () => {
      const response = await request(app)
        .get(`/refeicoes-turmas?turma=67fe721a879e5fc0cd3f2b76`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("O recurso solicitado não foi encontrado no servidor.");
    });
    it("deve retornar erro ao tentar listar refeições por turmas com uma descrição com menos de 3 caracteres", async () => {
      const response = await request(app)
        .get(`/refeicoes-turmas?descricao=a`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "descricao",
            message: "O campo 'descricao' deve ter pelo menos 3 caracteres.",
          }),
        ])
      );
    });
    it("deve retornar erro ao tentar listar refeições por turmas com uma descrição com mais de 100 caracteres", async () => {
      const response = await request(app)
        .get(`/refeicoes-turmas?descricao=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "descricao",
            message: "O campo 'descricao' deve ter no máximo 100 caracteres.",
          }),
        ])
      );
    });
  });
});

describe("Listar refeições por turma GET/:ID", () => {
  describe("Caminho feliz", () => {
    it("Deve listar uma refeição por turma com o id com sucesso", async () => {

      const response = await request(app)
        .get(`/refeicoes-turmas/${refeicaoTurmaInformation._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar refeição por turma com um id inexistente", async () => {
      const response = await request(app)
        .get(`/refeicoes-turmas/67fe721a879e5fc0cd3f2b76`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("Id inexistente");
    });
    it("deve retornar erro ao tentar listar refeição por turma com um id no formato inválido.", async () => {
      const response = await request(app)
        .get(`/refeicoes-turmas/123`)
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

describe("Cadastrar refeições por turma POST/", () => {
  let dadosRefeicaoTurma;
  describe("Caminho feliz", () => {
    it("deve cadastrar uma refeição por turma", async () => {
      dadosRefeicaoTurma = {
        turma: turmaValida,
        data_liberado: dataFaker,
        descricao: faker.lorem.sentence(10)
      };

      const response = await request(app)
        .post("/refeicoes-turmas")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(dadosRefeicaoTurma);

      expect(response.status).toBe(201);
      RefeicaoTurmaCadastrada = response.body.data;
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar refeição por turma com os mesmos dados já existentes", async () => {
      const response = await request(app)
        .post("/refeicoes-turmas")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(dadosRefeicaoTurma); // Reutilizando os mesmos dados do "Caminho feliz"

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("A requisição do cliente em conflito com o estado atual do servidor.");
    });
  });
});

describe("Atualizar refeições por turma PUT/:id", () => {
  describe("Caminho feliz", () => {
    it("deve atualizar uma refeição por turma com sucesso", async () => {
      const novosDados = {
        descricao: "Descrição atualizada"
      };

      const response = await request(app)
        .put(`/refeicoes-turmas/${refeicaoTurmaInformation._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(novosDados);

      expect(response.status).toBe(200);
      expect(response.body.data.descricao).toBe(novosDados.descricao);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar uma refeição por turma com um ID inexistente", async () => {
      const response = await request(app)
        .put(`/refeicoes-turmas/67fe721a879e5fc0cd3f2b76`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Descrição inválida",
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("O recurso solicitado não foi encontrado no servidor.");
    });
  });
});

describe("Deletar estágios DELETE/:id", () => {
  describe("Caminho feliz", () => {
    it("deve deletar uma refeição por turma com sucesso", async () => {
      const response = await request(app)
        .delete(`/refeicoes-turmas/${RefeicaoTurmaCadastrada._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(RefeicaoTurmaCadastrada._id);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar uma refeição por turma com um ID inexistente", async () => {
      const response = await request(app)
        .delete(`/refeicoes-turmas/67fe721a879e5fc0cd3f2b76`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("id");
    });

    it("deve retornar erro ao tentar deletar uma refeição por turma com um ID inválido", async () => {
      const response = await request(app)
        .delete(`/refeicoes-turmas/123`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
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
