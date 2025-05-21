import request from "supertest";
import { expect, it, describe, beforeAll, afterAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";

let token;
let permissaoCadastrada;
let permissaoCadastradaPost;
let grupoValido;
let rotaValida;

beforeAll(async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: "admin@gmail.com",
      senha: "Admin123@abc",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;

  const grupoResponse = await request(app)
    .get("/grupos")
    .set("Authorization", `Bearer ${token}`);
  expect(grupoResponse.status).toBe(200);
  grupoValido = grupoResponse.body.data.data[0]._id;

  const rotaResponse = await request(app)
    .get("/rotas")
    .set("Authorization", `Bearer ${token}`);
  expect(rotaResponse.status).toBe(200);
  rotaValida = rotaResponse.body.data.data[0]._id;

}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Listar permissões GET/", () => {
  describe("Caminho feliz", () => {
    it("Deve listar todas as permissões com sucesso", async () => {
      const response = await request(app)
        .get("/permissoes")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("data");
      expect(response.body.data.data.length).toBeGreaterThan(0);
      permissaoCadastrada = response.body.data.data[0];
    });

    it("Deve listar permissões com base no grupo", async () => {
      const response = await request(app)
        .get(`/permissoes?grupo=Admin`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.data.length).toBeGreaterThan(0);
    });

    it("Deve listar permissões com paginação", async () => {
      const response = await request(app)
        .get(`/permissoes?pagina=1&limite=5`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("page", 1);
      expect(response.body.data).toHaveProperty("limit", 10);
    });
  });

  describe("Caminho triste", () => {
    it("Deve retornar erro ao listar permissões com um grupo inexistente", async () => {
      const response = await request(app)
        .get(`/permissoes?grupo=GrupoInexistente`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("O recurso solicitado não foi encontrado no servidor.");
    });

    it("Deve retornar erro ao listar permissões sem autenticação", async () => {
      const response = await request(app).get("/permissoes");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Token não fornecido no cabeçalho de autorização");
    });
  });
});

describe("Cadastrar permissões POST/", () => {
  let dadosPermissao;

  describe("Caminho feliz", () => {
    it("Deve cadastrar uma permissão com sucesso", async () => {
      dadosPermissao = {
        metodos: ["GET", "POST"],
        grupo_id: grupoValido,
        rota_id: rotaValida,
      };

      const response = await request(app)
        .post("/permissoes")
        .set("Authorization", `Bearer ${token}`)
        .send(dadosPermissao);

      expect(response.status).toBe(201);
      permissaoCadastradaPost = response.body.data;

      expect(permissaoCadastradaPost).toHaveProperty("_id");
    });
  });

  describe("Caminho triste", () => {
    it("Deve retornar erro ao tentar cadastrar uma permissão com dados inválidos", async () => {
      const response = await request(app)
        .post("/permissoes")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: "metodos", message: "Required" }),
        ])
      );
    });
  });
});

describe("Atualizar permissões PUT/:id", () => {
  describe("Caminho feliz", () => {
    it("Deve atualizar uma permissão com sucesso", async () => {
      const novosDados = {
        metodos: ["PUT", "DELETE"],
      };
      const response = await request(app)
        .patch(`/permissoes/${permissaoCadastradaPost._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(novosDados);

      expect(response.status).toBe(200);
      expect(response.body.data.metodos).toEqual(novosDados.metodos);
    });
  });

  describe("Caminho Triste", () => {
    it("Deve atualizar uma permissão com tristeza profunda", async () => {
      const novosDados = {
        metodos: ["PUT", "DELETE"],
        rota_id: 123,
      };
      const response = await request(app)
        .patch(`/permissoes/${permissaoCadastradaPost._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(novosDados);

      expect(response.body).toHaveProperty("code", 400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "rota_id",
            message: "O campo 'rota_id' é obrigatório.",
          }),
        ])
      );
    });
  });
});

describe("Deletar permissões DELETE/:id", () => {
  describe("Caminho feliz", () => {
    it("Deve deletar uma permissão com sucesso", async () => {
      const response = await request(app)
        .delete(`/permissoes/${permissaoCadastradaPost._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
    });
  });
  describe("Caminho Triste", () => {
    it("Deve deletar uma permissão com tristewza CARA N AGUENTO MAIS", async () => {
      const response = await request(app)
        .delete(`/permissoes/${permissaoCadastradaPost._id}`)
        .set("Authorization", `Bearer ${token}`);
      
        expect(response.body).toHaveProperty("code", 404);
    });
  });
});