import request from "supertest";
import { expect, it, describe, beforeAll, afterAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

let token;
let rotaCadastrada;
let rotaPost

beforeAll(async () => {
  // Obter o token de autenticação
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

describe("Listar rotas GET/", () => {
  describe("Caminho feliz", () => {
    it("Deve listar todas as rotas com sucesso", async () => {
      const response = await request(app)
        .get("/rotas")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("data");
      expect(response.body.data.data.length).toBeGreaterThan(0);
      rotaCadastrada = response.body.data.data[0];
    });

    it("Deve listar rotas com base no nome", async () => {
      const response = await request(app)
        .get(`/rotas?nome=${rotaCadastrada.nome}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.data.length).toBeGreaterThan(0);
      expect(response.body.data.data[0].nome).toBe(rotaCadastrada.nome);
    });

    it("Deve listar rotas com paginação", async () => {
      const response = await request(app)
        .get(`/rotas?pagina=1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("page", 1);
    });
  });

  describe("Caminho triste", () => {
    it("Deve retornar erro ao listar rotas com um nome inexistente", async () => {
      const response = await request(app)
        .get(`/rotas?nome=NomeInexistente`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("O recurso solicitado não foi encontrado no servidor.");
    });

    it("Deve retornar erro ao listar rotas com uma página inválida", async () => {
      const response = await request(app)
        .get(`/rotas?pagina=-1`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "pagina",
            message: "A página precisa ser definida como um número inteiro positivo.",
          }),
        ])
      );
    });
  });
});

describe("Cadastrar rotas POST/", () => {
  describe("Caminho feliz", () => {
    it("Deve cadastrar uma rota com sucesso", async () => {
      const dadosRota = {
        nome: faker.lorem.words(2), 
        rota: [`/${faker.lorem.slug()}`],
      };

      const response = await request(app)
        .post("/rotas")
        .set("Authorization", `Bearer ${token}`)
        .send(dadosRota);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.nome).toBe(dadosRota.nome);
      expect(response.body.data.rota).toEqual(dadosRota.rota);
      rotaPost = response.body.data;
    });
  });

  describe("Caminho triste", () => {
    it("Deve retornar erro ao tentar cadastrar uma rota sem o campo 'nome'", async () => {
      const response = await request(app)
        .post("/rotas")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "", 
          rota: [`/${faker.lorem.slug()}`],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "nome",
            message: "Nome é obrigatório e deve conter pelo menos 1 caractere.",
          }),
        ])
      );
    });

    it("Deve retornar erro ao tentar cadastrar uma rota sem o campo 'rota'", async () => {
      const response = await request(app)
        .post("/rotas")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: faker.lorem.words(2),
          rota: [], 
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "rota",
            message: "A rota é obrigatória e deve conter pelo menos 1 caractere.",
          }),
        ])
      );
    });
  });
});

describe("Atualizar rotas PATCH/:id", () => {
  describe("Caminho feliz", () => {
    it("Deve atualizar uma rota com sucesso", async () => {
      const novosDados = {
        nome: "Rota Atualizada",
        rota: [`/${faker.lorem.slug()}`],
      };

      const response = await request(app)
        .patch(`/rotas/${rotaPost._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(novosDados);

      expect(response.status).toBe(200);
      expect(response.body.data.nome).toBe(novosDados.nome);
      expect(response.body.data.rota).toEqual(novosDados.rota);
    });
  });

  describe("Caminho triste", () => {
    it("Deve retornar erro ao tentar atualizar uma rota com um ID inexistente", async () => {
      const response = await request(app)
        .patch(`/rotas/67fe721a879e5fc0cd3f2b76`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "RotaInexistente",
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("O recurso solicitado não foi encontrado no servidor.");
    });

    it("Deve retornar erro ao tentar atualizar uma rota com um ID inválido", async () => {
      const response = await request(app)
        .patch(`/rotas/123`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "ID Inválido",
        });
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

describe("Deletar rotas DELETE/:id", () => {
  describe("Caminho feliz", () => {
    it("Deve deletar uma rota com sucesso", async () => {
      console.log(`/rotas/${rotaPost._id}`);
      const response = await request(app)
        .delete(`/rotas/${rotaPost._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe("Caminho triste", () => {
    it("Deve retornar erro ao tentar deletar uma rota com um ID inexistente", async () => {
      const response = await request(app)
        .delete(`/rotas/67fe721a879e5fc0cd3f2b76`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("O recurso solicitado não foi encontrado no servidor.");
    });
  });
});