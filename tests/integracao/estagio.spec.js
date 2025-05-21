import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
let token
let estagioInformation
const dataFaker_ini = faker.date.recent().toISOString()
const dataFaker_ter = faker.date.recent().toISOString()

// const matricula_faker = faker.string.numeric(13);
let estudanteValido
let estagioCadastrado

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
  const estudante = await request(app)
    .get("/estudantes")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${token}`);
  expect(estudante.status).toBe(200);
  estudanteValido = estudante.body.data.data[0]._id

}, 15000);//Coloquei 15 segundos de espera, pois por algum motivo o logar implementedo nessa api demora DEMAIIIIIIIIIIIIIIS

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Listar estágios GET/", () => {
  describe("Caminho feliz", () => {
    it("Deve listar todos os estágios com sucesso", async () => {
      const response = await request(app)
        .get("/estagios")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      estagioInformation = response.body.data.data[0]
    });
    it("deve listar um estágio com base na descrição", async () => {
      const response = await request(app)
        .get(`/estagios?descricao=${estagioInformation.descricao}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar um estágio com base no id do estudante", async () => {
      const response = await request(app)
      .get(`/estagios?estudante=${estagioInformation.estudante._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
    expect(response.error).toBe(false);
  });
  it("deve listar um estágio com base nos turnos", async () => {
    const response = await request(app)
      .get(`/estagios?turnos=segunda`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
    it("deve listar um estágio com base no status", async () => {
      const response = await request(app)
      .get(`/estagios?status=${estagioInformation.status}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  });
});
describe("Caminho triste", () => {
  it("deve retornar erro ao tentar listar um estágio com uma data_inicio no formato errado.", async () => {
    const response = await request(app)
      .get(`/estagios?data_inicio=asdadasdasd`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveProperty("code", 400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "data_inicio",
          message: "O formato deve ser 'YYYY-MM-DD,YYYY-MM-DD'.",
        }),
      ])
    );
  });
  it("deve retornar erro ao tentar listar um estágio com uma data_termino no formato errado.", async () => {
    const response = await request(app)
      .get(`/estagios?data_termino=asdadasdasd`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveProperty("code", 400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "data_termino",
          message: "O formato deve ser 'YYYY-MM-DD,YYYY-MM-DD'.",
        }),
      ])
    );
  });
  it("deve retornar erro ao tentar listar um estágio com um dia do turno que está em número.", async () => {
    const response = await request(app)
      .get(`/estagios?turnos=121312312`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveProperty("code", 400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "turnos",
          message: "O turno precisa ser um dia da semana",
        }),
      ])
    );
  });
  it("deve retornar erro ao tentar listar um estágio com um dia do turno que está em false.", async () => {
    const response = await request(app)
      .get(`/estagios?turnos=segunda%2Cterca%2Cquarta%2Cquinta%2Csexta%2Csabado%2Cdomingo`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveProperty("code", 404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Nenhum estágio encontrado.");
  });
  it("deve retornar erro ao tentar listar um estágio com uma descrição não existente.", async () => {
    const response = await request(app)
      .get(`/estagios?descricao=12312313221313`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveProperty("code", 404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Nenhum estágio encontrado.");
  });
  it("deve retornar erro ao tentar listar um estágio com um status que não seja \"Em andamento\", \"Encerrado\" ou \"Pausado\".", async () => {
    const response = await request(app)
      .get(`/estagios?status=121312312`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveProperty("code", 400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "status",
          message: "Deverá ser os seguintes campos: Em andamento, Encerrado, Pausado.",
        }),
      ])
    );
  });
  it("deve retornar erro ao tentar listar um estágio com um status não existente.", async () => {
    const response = await request(app)
      .get(`/estagios?descricao=Pausado`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveProperty("code", 404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Nenhum estágio encontrado.");
  });
});

describe("Listar estágio GET/:ID", () => {
  describe("Caminho feliz", () => {
    it("Deve listar um estágio com sucesso", async () => {
      const response = await request(app)
        .get(`/estagios/${estagioInformation._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  });
  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar listar um estagio com um id não existente", async () => {
      const response = await request(app)
        .get(`/estagios/67fe721a879e5fc0cd3f2b76`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body).toHaveProperty("code", 404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toEqual("Estágio não encontrado");
    });
    it("deve retornar erro ao tentar listar um estágio com um id no formato inválido.", async () => {
      const response = await request(app)
        .get(`/estagios/123`)
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

describe("Cadastrar estágios POST/", () => {
  let dadosEstagio; 
  describe("Caminho feliz", () => {
    it("deve cadastrar um estágio", async () => {
      dadosEstagio = {
        estudante: estudanteValido,
        data_inicio: dataFaker_ini,
        data_termino: dataFaker_ter,
        turnos: { "segunda": true, "terca": true, "quarta": true, "quinta": true, "sexta": true, "sabado": false, "domingo": false },
        descricao: faker.lorem.sentence(10),
        status: "Em andamento",
      };

      const response = await request(app)
        .post("/estagios")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(dadosEstagio);

      expect(response.status).toBe(201);
      estagioCadastrado = response.body.data;
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar cadastrar um estágio com os mesmos dados já existentes", async () => {
      const response = await request(app)
        .post("/estagios") 
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(dadosEstagio); 

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual("A requisição do cliente em conflito com o estado atual do servidor.");
    });
  });
});

describe("Atualizar estágios PUT/:id", () => {
  describe("Caminho feliz", () => {
    it("deve atualizar um estágio com sucesso", async () => {
      const novosDados = {
        descricao: "Descrição atualizada",
        status: "Encerrado",
      };

      const response = await request(app)
        .put(`/estagios/${estagioCadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(novosDados);

      expect(response.status).toBe(200);
      expect(response.body.data.descricao).toBe(novosDados.descricao);
      expect(response.body.data.status).toBe(novosDados.status);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar atualizar um estágio com um ID inexistente", async () => {
      const response = await request(app)
        .put(`/estagios/67fe721a879e5fc0cd3f2b76`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Descrição inválida",
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("id");
    });

    it("deve retornar erro ao tentar atualizar um estágio com dados iguais aos existentes", async () => {
      const response = await request(app)
        .put(`/estagios/${estagioCadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({estagioCadastrado});

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("data_inicio, data_termino, status, turnos, status e descricao");
    });
  });
});

describe("Deletar estágios DELETE/:id", () => {
  describe("Caminho feliz", () => {
    it("deve deletar um estágio com sucesso", async () => {
      const response = await request(app)
        .delete(`/estagios/${estagioCadastrado._id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(estagioCadastrado._id);
    });
  });

  describe("Caminho triste", () => {
    it("deve retornar erro ao tentar deletar um estágio com um ID inexistente", async () => {
      const response = await request(app)
        .delete(`/estagios/67fe721a879e5fc0cd3f2b76`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("estagio");
    });

    it("deve retornar erro ao tentar deletar um estágio com um ID inválido", async () => {
      const response = await request(app)
        .delete(`/estagios/123`)
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