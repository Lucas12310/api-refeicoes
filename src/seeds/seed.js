import "dotenv/config";
import mongoose from "mongoose";

// Se você usa @faker-js/faker:
import { faker } from "@faker-js/faker";

// Se quiser faker em pt-BR, pode usar:
// import { faker } from "@faker-js/faker/locale/pt_BR";

// Dependências
import bcrypt from "bcryptjs";

// Conexão com banco
import { conectarBanco } from "../config/dbConnect.js";

// Models principais
import Usuario from "../models/Usuario.js";
import Curso from "../models/Curso.js";
import Turma from "../models/Turma.js";
import Estudante from "../models/Estudante.js";
import Projeto from "../models/Projeto.js";
import Estagio from "../models/Estagio.js";
import Refeicao from "../models/Refeicao.js";
import RefeicaoTurma from "../models/RefeicaoTurma.js";
import Grupo from "../models/Grupo.js";
import Rota from "../models/Rota.js";
import Permissoes from "../models/Permissoes.js";

// DTO de Usuário (caso seja necessário)
import UsuarioCreateDTO from "../dtos/usuario/UsuarioCreateDTO.js";

// Seu mapeador “globalFakeMapping” (se estiver usando)
import getGlobalFakeMapping from "./getGlobalFakeMapping.js";
// ----------------------------------------------------------------------------
// 1) Conectar ao banco de dados
// ----------------------------------------------------------------------------
const globalFakeMapping = await getGlobalFakeMapping();
await conectarBanco();

// ----------------------------------------------------------------------------
// 2) Funções auxiliares
// ----------------------------------------------------------------------------
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Senha para usuário normal (não admin) e senha para admin
const senhaPura = "ABab@123456";
const senhaHash = await bcrypt.hash(senhaPura, Number(process.env.SALT_LENGTH) || 16);
const adminSenhaHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, Number(process.env.SALT_LENGTH) || 16);

// ----------------------------------------------------------------------------
// 3) SEED de Grupos, Rotas e Permissões
// ----------------------------------------------------------------------------

async function seedGrupos() {
  await Grupo.deleteMany();

  // Caso haja mais grupos no futuro deverá ser adicionado aqui
  const grupos = [
    { _id: new mongoose.Types.ObjectId(), nome: "Admin" },
    { _id: new mongoose.Types.ObjectId(), nome: "Funcionário" },
  ];

  await Grupo.insertMany(grupos);
  console.log("Grupos adicionados com sucesso!");
  return grupos;
}

async function seedRotas() {
  await Rota.deleteMany();

  //Mexa a aqui se precisar adicionar mais rotas
  const rotas = [
    { _id: new mongoose.Types.ObjectId(), nome: "Usuários", rota: ["/usuarios","/usuarios/:id"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Cursos", rota: ["/cursos", "/cursos/:id"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Turmas", rota: ["/turmas","/turmas/:id"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Estudantes", rota: ["/estudantes", "/estudantes/:id", "/estudantes/inativar"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Refeições", rota: ["/refeicoes"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Refeições por turma", rota: ["/refeicoes-turmas","/refeicoes-turmas/:id"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Estágios", rota: ["/estagios","/estagios/:id"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Projetos", rota: ["/projetos","/projetos/:id"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Grupos", rota: ["/grupos","/grupos/:id"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Rotas", rota: ["/rotas","/rotas/:id"] },
    { _id: new mongoose.Types.ObjectId(), nome: "Permissões", rota: ["/permissoes","/permissoes/:id"] },
  ];

  await Rota.insertMany(rotas);
  console.log("Rotas adicionadas com sucesso!");
  return rotas;
}

async function seedPermissoes(grupos, rotas) {
  await Permissoes.deleteMany();

  const permissoes = [];

  //Esse forEach basicamente insere um array de objetos com as permissões de cada grupo para cada rota
  //O grupo admin tem acesso a todos os métodos
  //Os outros grupos tem acesso apenas a GET e POST AAPENAS NA rota de refeicoes
  rotas.forEach((rota) => {
    grupos.forEach((grupo) => {
      if (grupo.nome === "Admin") {
        permissoes.push({
          metodos: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          grupo_id: grupo._id,
          rota_id: rota._id,
        });
      } else if (rota.rota.includes("/refeicoes")) {
        permissoes.push({
          metodos: ["GET", "POST"],
          grupo_id: grupo._id,
          rota_id: rota._id,
        });
      }
    });
  });

  await Permissoes.insertMany(permissoes);
  console.log("Permissões adicionadas com sucesso!");
}

// ----------------------------------------------------------------------------
// 4) SEED de Usuários
// ----------------------------------------------------------------------------

async function seedUsuarios(grupos) {
  // Remove
  await Usuario.deleteMany();

  // Encontrar os grupos necessários
  const adminGrupo = grupos.find((g) => g.nome === "Admin");
  const funcionarioGrupo = grupos.find((g) => g.nome === "Funcionário");

  const usuariosFixos = [
    {
      nome: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      senha: adminSenhaHash,
      ativo: true,
      grupo: adminGrupo?._id, 
    },
    {
      nome: "APP de Oliveira",
      email: "app@gmail.com",
      senha: adminSenhaHash,
      ativo: true,
      grupo: adminGrupo?._id, 
    },
    {
      nome: "Dev2 Oliveira",
      email: "dev2@gmail.com",
      senha: senhaHash,
      ativo: true,
      grupo: funcionarioGrupo?._id, 
    },
  ];

  const usuariosFixosDTO = await Promise.all(
    usuariosFixos.map((u) => UsuarioCreateDTO.create(u))
  );
  await Usuario.collection.insertMany(usuariosFixosDTO);
  console.log(usuariosFixosDTO.length + " Usuários fixos inseridos!");

  // Agora cria aleatórios
  const usuariosAleatorios = [];
  for (let i = 0; i < 200; i++) {
    const primeiroNome = globalFakeMapping.nome(); 
    const sobrenome = faker.person.lastName();
    const nomeCompleto = `${primeiroNome} ${sobrenome} ${faker.person.lastName()}`;
    
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const domain = faker.internet.domainName();
    const email = `${firstName}.${lastName}@${domain}`.toLowerCase();
    
    const randomGrupo = grupos[getRandomInt(grupos.length)];
    usuariosAleatorios.push({
      nome: nomeCompleto,
      email,
      senha: senhaHash,
      ativo: globalFakeMapping.ativo(),
      grupo: randomGrupo?._id, // Certificar-se de usar o _id do grupo aleatório
    });
  }

  const usuariosAleatoriosDTO = await Promise.all(
    usuariosAleatorios.map((u) => UsuarioCreateDTO.create(u))
  );
  await Usuario.collection.insertMany(usuariosAleatoriosDTO);
  console.log(usuariosAleatoriosDTO.length + " Usuários aleatórios inseridos!");
}

// ----------------------------------------------------------------------------
// 5) SEED de Curso, Turma, Estudante, Projeto, Estágio
// ----------------------------------------------------------------------------
async function seedCursos() {
  await Curso.deleteMany();

  const infoMock = {
    nome: "Informática",
    contra_turnos: { segunda: false, terca: false, quarta: true, quinta: false, sexta: false, sabado: false, domingo: false },
    codigo_suap: "0303",
  };
  const edifMock = {
    nome: "Edificações",
    contra_turnos: { segunda: false, terca: true, quarta: false, quinta: false, sexta: false, sabado: false, domingo: false },
    codigo_suap: "0301",
  };
  const eletroMock = {
    nome: "Eletromecânica",
    contra_turnos: { segunda: true, terca: false, quarta: false, quinta: false, sexta: false, sabado: false, domingo: false },
    codigo_suap: "0302",
  };
  const adsMock = {
    nome: "ADS",
    contra_turnos: { segunda: true, terca: false, quarta: false, quinta: false, sexta: false, sabado: false, domingo: false },
    codigo_suap: "0314",
  };

  await Curso.create(infoMock);
  await Curso.create(edifMock);
  await Curso.create(eletroMock);
  await Curso.create(adsMock);

  console.log("Cursos adicionados com sucesso!");
}

async function seedTurmas() {
  await Turma.deleteMany();

  const turmaDescrioes = [
    "Informática 1A", "Informática 2A", "Informática 3A",
    "Informática 1B", "Informática 2B", "Informática 3B",
    "Edificações 1A", "Edificações 2A", "Edificações 3A",
    "Edificações 1B", "Edificações 2B", "Edificações 3B",
    "Eletromecânica 1A", "Eletromecânica 2A", "Eletromecânica 3A",
    "Eletromecânica 1B", "Eletromecânica 2B", "Eletromecânica 3B",
  ];
  const turmaCodigos = [
    "20241.1.0303.1M","20241.2.0303.1M","20241.3.0303.1M",
    "20241.1.0303.1D","20241.2.0303.1D","20241.3.0303.1D",
    "20241.1.0301.1M","20241.2.0301.1M","20241.3.0301.1M",
    "20241.1.0301.1D","20241.2.0301.1D","20241.3.0301.1D",
    "20241.1.0302.1M","20241.2.0302.1M","20241.3.0302.1M",
    "20241.1.0302.1D","20241.2.0302.1D","20241.3.0302.1D",
  ];

  const cursos = await Curso.find({});
  const info = cursos.find((c) => c.nome === "Informática");
  const edif = cursos.find((c) => c.nome === "Edificações");
  const eletro = cursos.find((c) => c.nome === "Eletromecânica");

  for (let i = 0; i < turmaDescrioes.length; i++) {
    const descricao = turmaDescrioes[i];
    let cursoId = null;
    if (descricao.includes("Informática")) cursoId = info?._id;
    else if (descricao.includes("Edificações")) cursoId = edif?._id;
    else cursoId = eletro?._id;

    await Turma.create({
      codigo_suap: turmaCodigos[i],
      descricao,
      curso: cursoId,
    });
  }
  console.log("Turmas adicionadas com sucesso!");
}

async function seedEstudantes() {
  await Estudante.deleteMany();

  const turmas = await Turma.find({});
  const cursos = await Curso.find({});
  for (let i = 0; i < 100; i++) {
    const randomTurma = turmas[getRandomInt(turmas.length)];
    const randomCurso = cursos[getRandomInt(cursos.length)];
    const matricula = faker.string.numeric(13);

    await Estudante.create({
      matricula,
      nome: faker.person.fullName(),
      turma: randomTurma?._id,
      curso: randomCurso?._id,
      ativo: true,
    });
  }
  console.log("Estudantes gerados com sucesso!");
}

async function seedProjetos() {
  await Projeto.deleteMany();

  // Precisamos de 50 estudantes
  const estudantes = await Estudante.find({}).limit(50);

  for (let i = 0; i < 10; i++) {
    const estudantesProjeto = estudantes.slice(i * 5, (i + 1) * 5);
    await Projeto.create({
      nome: `Projeto ${faker.hacker.noun()}`,
      data_inicio: faker.date.recent(),
      data_termino: faker.date.future(),
      estudantes: estudantesProjeto.map((e) => e._id),
      turnos: {
        segunda: faker.datatype.boolean(),
        terca: faker.datatype.boolean(),
        quarta: faker.datatype.boolean(),
        quinta: faker.datatype.boolean(),
        sexta: faker.datatype.boolean(),
        sabado: faker.datatype.boolean(),
        domingo: faker.datatype.boolean(),
      },
      status: "Em andamento",
    });
  }
  console.log("Projetos adicionados com sucesso!");
}

async function seedEstagios() {
  await Estagio.deleteMany();

  // 5 estágios
  const estudantes = await Estudante.find({}).limit(5);
  for (let i = 0; i < 5; i++) {
    const estudante = estudantes[i];
    await Estagio.create({
      descricao: "Estágio na CGTI do IFRO campus Vilhena",
      data_inicio: faker.date.recent(),
      data_termino: faker.date.future(),
      estudante: estudante?._id,
      turnos: {
        segunda: faker.datatype.boolean(),
        terca: faker.datatype.boolean(),
        quarta: faker.datatype.boolean(),
        quinta: faker.datatype.boolean(),
        sexta: faker.datatype.boolean(),
        sabado: faker.datatype.boolean(),
        domingo: faker.datatype.boolean(),
      },
      status: "Em andamento",
    });
  }
  console.log("Estágios adicionados com sucesso!");
}

// ----------------------------------------------------------------------------
// 6) SEED de Refeicao e RefeicaoTurma(1000 cada)
// ----------------------------------------------------------------------------

async function seedRefeicoes() {
  // Remove tudo
  await Refeicao.deleteMany();

  // Buscar estudantes, usuários, cursos e turmas para referenciar
  const estudantes = await Estudante.find({}).populate("curso").populate("turma");
  const usuarios = await Usuario.find({});

  // Possíveis tipos de refeição
  const tipos = ["Contra-turno", "Projeto", "Estágio", "Tuma"];

  const listaRefeicoes = [];
  for (let i = 0; i < 1000; i++) {
    // Random estudante
    const estudanteRandom = estudantes[getRandomInt(estudantes.length)];
    // Random user
    const usuarioRandom = usuarios[getRandomInt(usuarios.length)];
    // Random tipo
    const tipoRefeicao = tipos[getRandomInt(tipos.length)];

    const doc = {
      estudante: {
        id: estudanteRandom._id,
        nome: estudanteRandom.nome,
        matricula: estudanteRandom.matricula,
        curso: estudanteRandom.curso?.nome || "Curso não encontrado",
        turma: estudanteRandom.turma?.descricao || "Turma não encontrada",
      },
      data: faker.date.recent({ days: 30 }), // data aleatória nos últimos 30 dias
      tipoRefeicao,
      usuarioRegistrou: usuarioRandom._id,
    };
    listaRefeicoes.push(doc);
  }

  await Refeicao.collection.insertMany(listaRefeicoes);
  console.log(listaRefeicoes.length + " Refeicoes inseridas!");
}

// ----------------------------------------------------------------------------
// 7) SEED de Refeicao e RefeicoesTurma (1000 cada)
// ----------------------------------------------------------------------------
async function seedRefeicoesTurma() {
  // Remove
  await RefeicaoTurma.deleteMany();

  // Buscar turmas
  const turmas = await Turma.find({});
  const listaRT = [];

  for (let i = 0; i < 1000; i++) {
    const turmaRandom = turmas[getRandomInt(turmas.length)];

    const doc = {
      turma: turmaRandom._id,
      data_liberado: faker.date.future(), // Exemplo: data futura
      descricao: faker.lorem.sentence(),
    };
    listaRT.push(doc);
  }

  await RefeicaoTurma.collection.insertMany(listaRT);
  console.log(listaRT.length + " RefeicoesTurma inseridas!");
}

// ----------------------------------------------------------------------------
// 8) Execução final (ordem de chamada)
// ----------------------------------------------------------------------------
async function main() {
  try {
    // 1) Entidades de acesso
    const grupos = await seedGrupos();
    const rotas = await seedRotas();
    await seedPermissoes(grupos, rotas);

    // 2) Entidades “Meals”
    await seedUsuarios(grupos);
    await seedCursos();
    await seedTurmas();
    await seedEstudantes();
    await seedProjetos();
    await seedEstagios();

    // 3) Refeicoes e RefeicoesTurma
    await seedRefeicoes();
    await seedRefeicoesTurma();

    console.log(">>> SEED FINALIZADO COM SUCESSO! <<<");
  } catch (err) {
    console.error("Erro ao executar SEED:", err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Executa tudo
main();
