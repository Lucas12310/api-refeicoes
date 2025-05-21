import request from "supertest";
import { expect, it, describe, beforeAll } from "@jest/globals";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
let token
let turmaValida = ""
let codigo_suap_faker_int = ""
let codigo_suap_faker = ""
let turma_faker = faker.commerce.department();
let turmaCadastrada = ""
let idCursoAlmocoHoje
let nomeCursoAlmocoHoje
let idTurmaAlmocoHoje
let nomeTurmaAlmocoHoje
let estudante_faker 
let matricula_faker 
let curso_faker = "";
let projeto_faker = "Projeto " + faker.commerce.department();

//projeto
let hoje = new Date();
// Formata a data como "YYYY-MM-DD"
let data_inicio = hoje.toISOString().split('T')[0];
// Cria a data de término (1 ano depois)
let termino = new Date();
termino.setFullYear(hoje.getFullYear() + 1);
let data_termino = termino.toISOString().split('T')[0];


// definindo o contra turno dinamico
const dataAtual = new Date();
const semana = ["domingo","segunda","terca","quarta","quinta","sexta","sabado",]; 
const diaSemana = dataAtual.getDay(); // 0 a 6
const diaAtual = semana[diaSemana]; // nome do dia da semana
const diaAmanha = semana[diaSemana+1];
// Gera o objeto com todos os dias como false
const contra_turnoHoje = semana.reduce((obj, dia) => {
  obj[dia] = false;
  return obj;
}, {});
const contra_turnoAmanha = semana.reduce((obj, dia) => {
  obj[dia] = false;
  return obj;
}, {});
contra_turnoHoje[diaAtual] = true; 
contra_turnoAmanha[diaAmanha] = true; 

let curso 
let turma 
let aluno 
let projeto
let estagio
let contra_turno_atipico
let estudanteativo
// formatando a hora do usuario para o horario de vilhena/RO, o sistema irá sempre seguir o horário de vha
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Porto_Velho',
      dateStyle: 'full',
      timeStyle: 'long'
    });
   
    const dataFormatMongo = formatter.format(dataAtual);
    const clean = dataFormatMongo.replace(/^.*?,\s*/, '').replace(' às ', ' ').replace(' AMT', '');

  // Mapeia meses em português para números
  const meses = {
    janeiro: '01',
    fevereiro: '02',
    março: '03',
    abril: '04',
    maio: '05',
    junho: '06',
    julho: '07',
    agosto: '08',
    setembro: '09',
    outubro: '10',
    novembro: '11',
    dezembro: '12'
  };

  // Extrai partes da data
  const regex = /(\d{2}) de (\w+) de (\d{4}) (\d{2}):(\d{2}):(\d{2})/;
  const match = clean.match(regex);

  const [_, dia, mesNome, ano, hora, minuto, segundo] = match;
  const mes = meses[mesNome.toLowerCase()];

  // Cria a data como se fosse no fuso UTC-4 (AMT)
  const dateInAMT = new Date(Date.UTC(
    parseInt(ano), 
    parseInt(mes) - 1, 
    parseInt(dia),
    parseInt(hora), // ajusta fuso UTC-4 para UTC
    parseInt(minuto),
    parseInt(segundo)
  ));



beforeAll(async () => {
  const response = await request(app).post("/login")
    .send({
      email: "admin@gmail.com",
      senha: "Admin123@abc",
    });

  expect(response.status).toBe(200);
  token = response.body.data.accessToken;
   //curso = await CadastrarCurso(contra_turnoHoje)
   //turma = await CadastrarTurma()
   //aluno =  await CadastrarEstudante()
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
});

async function CadastrarCurso(contraturno){
  curso_faker = faker.person.jobArea()
  codigo_suap_faker_int = faker.number.int({ min: 1, max: 10000 });
  codigo_suap_faker = codigo_suap_faker_int.toString();
  const response = await request(app).post("/cursos").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        nome: curso_faker,
        contra_turnos: contraturno,
        codigo_suap: codigo_suap_faker
      });
      idCursoAlmocoHoje = response.body.data._id
      nomeCursoAlmocoHoje = response.body.data.nome
      return response.body.data
}

async function CadastrarTurma(){
  const response = await request(app).post("/turmas").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        codigo_suap: `20251.1.${codigo_suap_faker}.1A`,
        descricao: `${nomeCursoAlmocoHoje} 1A`,
        curso: idCursoAlmocoHoje
      });
      idTurmaAlmocoHoje = response.body.data._id
      nomeTurmaAlmocoHoje = response.body.data.descricao
      return response.body.data
}
async function CadastrarEstudante(ativo){
  estudante_faker = faker.person.fullName();
  matricula_faker = faker.string.numeric(13);
  const response = await request(app).post("/estudantes").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        nome: estudante_faker,
        matricula: matricula_faker,
        turma: idTurmaAlmocoHoje,
        curso: idCursoAlmocoHoje,
        ativo: ativo,
      });
      return response.body.data
}

async function CadastrarProjeto(id){
  const response = await request(app).post("/projetos").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        estudantes: [
          id
        ],
        nome: projeto_faker,
        data_inicio: data_inicio,
        data_termino: data_termino,
        status: "Em andamento",
        turnos: contra_turnoHoje
      });
      return response.body.data
}

async function CadastrarEstagio(id){
  const response = await request(app).post("/estagios").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
    .send({
      estudante: id,
      data_inicio: data_inicio,
      data_termino: data_termino,
      turnos: contra_turnoHoje,
      descricao: faker.lorem.sentence(10),
      status: "Em andamento",
    });
      return response.body.data
}

async function CadastrarContraTurnoAtipico(id){
  const response = await request(app).post("/refeicoes-turmas").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        turma: id,
        data_liberado: dateInAMT,
        descricao: "Acceptus cunae laudantium triduana textus compello articulus."
      });
      return response.body.data
}

describe("Testes de refeições", () => {
  it("Deve cadastrar uma refeição contra-turno", async () => {
    curso = await CadastrarCurso(contra_turnoHoje)
    turma = await CadastrarTurma()
    estudanteativo = true
    aluno =  await CadastrarEstudante(estudanteativo)
    const response = await request(app).post("/refeicoes").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        matricula: aluno.matricula,
      });
    expect(response.body.code).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.message).toBe("Requisição bem sucedida, recurso foi criado");
    console.log("O aluno: " + aluno.nome + " almoçou por estar em contraturno")
  });
  it("Deve cadastrar uma refeição projeto", async () => {
    curso = await CadastrarCurso(contra_turnoAmanha)
    turma = await CadastrarTurma()
    estudanteativo = true
    aluno =  await CadastrarEstudante(estudanteativo)
    projeto =  await CadastrarProjeto(aluno._id)
    const response = await request(app).post("/refeicoes").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        matricula: aluno.matricula,
      });
    expect(response.body.code).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.message).toBe("Requisição bem sucedida, recurso foi criado");
    console.log("O aluno: " + aluno.nome + " almoçou por estar em um projeto")
  });
  it("Deve cadastrar uma refeição estagio", async () => {
    curso = await CadastrarCurso(contra_turnoAmanha)
    turma = await CadastrarTurma()
    estudanteativo = true
    aluno =  await CadastrarEstudante(estudanteativo)
    estagio = await CadastrarEstagio(aluno._id)
    const response = await request(app).post("/refeicoes").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        matricula: aluno.matricula,
      });
    expect(response.body.code).toBe(201);
    expect(response.body.error).toBe(false);
    expect(response.body.message).toBe("Requisição bem sucedida, recurso foi criado");
    console.log("O aluno: " + aluno.nome + " almoçou por estar em um estágio")
  });
  it("Deve cadastrar uma refeição contra turno atipico", async () => {
    curso = await CadastrarCurso(contra_turnoAmanha)
    turma = await CadastrarTurma()
    estudanteativo = true
    aluno =  await CadastrarEstudante(estudanteativo)
    contra_turno_atipico = await CadastrarContraTurnoAtipico(turma._id)
    const response = await request(app).post("/refeicoes").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        matricula: aluno.matricula,
      });
      expect(response.body.code).toBe(201);
      expect(response.body.error).toBe(false);
      expect(response.body.message).toBe("Requisição bem sucedida, recurso foi criado");
      console.log("O aluno: " + aluno.nome + " almoçou por estar em um contraturno atípico")
  });
  it("Deve retornar que o aluno ja almoçou hoje", async () => {
    const response = await request(app).post("/refeicoes").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        matricula: aluno.matricula,
      });
      expect(response.body.code).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Estudante já almoçou hoje!");
  });
  it("Deve retornar que o aluno não pode almoçar hoje", async () => {
    curso = await CadastrarCurso(contra_turnoAmanha)
    turma = await CadastrarTurma()
    estudanteativo = true
    aluno =  await CadastrarEstudante(estudanteativo)
    const response = await request(app).post("/refeicoes").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        matricula: aluno.matricula,
      });
      expect(response.body.code).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Estudante não pode almoçar hoje");
  });
  it("Deve retornar que o aluno está inativo", async () => {
    curso = await CadastrarCurso(contra_turnoAmanha)
    turma = await CadastrarTurma()
    estudanteativo = false
    aluno =  await CadastrarEstudante(estudanteativo)
    const response = await request(app).post("/refeicoes").set("Content-Type", "application/json").set("Authorization", `Bearer ${token}`)
      .send({
        matricula: aluno.matricula,
      });
      expect(response.body.code).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Estudante não está ativo!");
  });
});
