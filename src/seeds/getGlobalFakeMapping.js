// /src/seeds/globalFakeMapping.js

import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import loadModels from './loadModels.js';
import PasswordResetCode from '../models/PasswordResetCode.js';

/**
 * Estrutura de mappings organizada por model. Serve para gerar dados falsos de forma
 * automatizada, utilizando o Faker.js. Cada model pode ter um mapping específico,
 * além de um conjunto de campos comuns a vários models.
 */
const fakeMappings = {
  // Campos comuns a vários models
  common: { 
    nome: () =>
      faker.person.firstName() +
      " " +
      faker.person.lastName() +
      " " +
      faker.person.lastName(),
    email: () => faker.internet.email(),
    senha: () => faker.internet.password(),
    ativo: () => faker.datatype.boolean(),
    descricao: () => faker.lorem.sentence(),
    localidade: () => faker.address.city() + " - " + faker.address.state(),
    rota: () => faker.lorem.word(10),
    dominio: () => faker.internet.url(),
    // Arrays de referências
    unidades: () => [{ _id: new mongoose.Types.ObjectId().toString() }],
    grupos: () => [{ _id: new mongoose.Types.ObjectId().toString() }],
    // Permissões (objeto complexo)
    permissoes: () => [
      {
        rota: faker.lorem.word(),
        dominio: faker.internet.url(),
        ativo: faker.datatype.boolean(),
        buscar: faker.datatype.boolean(),
        enviar: faker.datatype.boolean(),
        substituir: faker.datatype.boolean(),
        modificar: faker.datatype.boolean(),
        excluir: faker.datatype.boolean(),
      },
    ],
    // Campos para versionamento e permissões simples
    dataVersao: () => faker.date.past(),
    historico: () => [],
    buscar: () => faker.datatype.boolean(),
    enviar: () => faker.datatype.boolean(),
    substituir: () => faker.datatype.boolean(),
    modificar: () => faker.datatype.boolean(),
    excluir: () => faker.datatype.boolean(),
  },

  // Mapping específico para o model Curso
  Curso: {
    contra_turnos: () => ({
      segunda: faker.datatype.boolean(),
      terca: faker.datatype.boolean(),
      quarta: faker.datatype.boolean(),
      quinta: faker.datatype.boolean(),
      sexta: faker.datatype.boolean(),
      sabado: faker.datatype.boolean(),
      domingo: faker.datatype.boolean(),
    }),
    codigo_suap: () =>
      faker.number.int({ min: 1000, max: 9999 }).toString(),
  },

  // Mapping específico para o model Estagio
  Estagio: {
    estudante: () => new mongoose.Types.ObjectId().toString(),
    data_inicio: () => faker.date.past(),
    data_termino: () => faker.date.future(),
    turnos: () => ({
      segunda: faker.datatype.boolean(),
      terca: faker.datatype.boolean(),
      quarta: faker.datatype.boolean(),
      quinta: faker.datatype.boolean(),
      sexta: faker.datatype.boolean(),
      sabado: faker.datatype.boolean(),
      domingo: faker.datatype.boolean(),
    }),
    status: () => {
      const values = ["Em andamento", "Encerrado", "Pausado"];
      return values[Math.floor(Math.random() * values.length)];
    },
  },

  // Mapping específico para o model Estudante
  Estudante: {
    matricula: () => faker.number.int().toString(),
    turma: () => new mongoose.Types.ObjectId().toString(),
    curso: () => new mongoose.Types.ObjectId().toString(),
  },

  // Mapping específico para o model Projeto
  Projeto: {
    estudantes: () => [new mongoose.Types.ObjectId().toString()],
    data_inicio: () => faker.date.past(),
    data_termino: () => faker.date.future(),
    turnos: () => ({
      segunda: faker.datatype.boolean(),
      terca: faker.datatype.boolean(),
      quarta: faker.datatype.boolean(),
      quinta: faker.datatype.boolean(),
      sexta: faker.datatype.boolean(),
      sabado: faker.datatype.boolean(),
      domingo: faker.datatype.boolean(),
    }),
    status: () => {
      const values = ["Em andamento", "Encerrado", "Pausado"];
      return values[Math.floor(Math.random() * values.length)];
    },
  },

  // Mapping específico para o model Refeicao
  Refeicao: {
    estudante: () => new mongoose.Types.ObjectId().toString(),
    data: () => faker.date.past(),
    tipoRefeicao: () => faker.lorem.word(),
    usuarioRegistrou: () => new mongoose.Types.ObjectId().toString(),
  },

  // Mapping específico para o model RefeicaoTurma
  RefeicaoTurma: {
    turma: () => new mongoose.Types.ObjectId().toString(),
    data_liberado: () => faker.date.past(),
  },

  // Mapping específico para o model Turma
  Turma: {
    codigo_suap: () => faker.string.alphanumeric(6),
    curso: () => new mongoose.Types.ObjectId().toString(),
  },

  // Mapping específico para o model Usuario
  Usuario: {
    refreshToken: () => faker.string.uuid(),
    accessToken: () => faker.string.uuid(),
    grupo: () => new mongoose.Types.ObjectId().toString(),
  },

  // Mapping específico para o model Permissoes
  Permissoes: {
    grupo: () => faker.lorem.word(),
    metodos: () => ["GET", "POST", "PATCH", "DELETE"],
    grupo_id: () => new mongoose.Types.ObjectId().toString(),
    rota_id: () => new mongoose.Types.ObjectId().toString(),
  },
  Rota: {
    _id: () => new mongoose.Types.ObjectId().toString(),
    nome: () => "Admin",
    rota: () => ["/estudantes", "/estudantes/:id", "/estudantes/inativar"],
  },
  PasswordResetCode:{
    code: () => faker.string.numeric(6),
    expiresAt: () => faker.date.future(),
    used: ()=> faker.datatype.boolean(),
  }
};

/**
 * Retorna o mapping global, consolidando os mappings comuns e específicos.
 * Nesta versão automatizada, carregamos os models e combinamos o mapping comum com o mapping específico de cada model.
 */
export async function getGlobalFakeMapping() {
  const models = await loadModels();
  let globalMapping = { ...fakeMappings.common };

  models.forEach(({ name }) => {
    if (fakeMappings[name]) {
      globalMapping = {
        ...globalMapping,
        ...fakeMappings[name],
      };
    }
  });

  return globalMapping;
}

/**
 * Função auxiliar para extrair os nomes dos campos de um schema,
 * considerando apenas os níveis superiores (campos aninhados são verificados pela parte antes do ponto).
 */
function getSchemaFieldNames(schema) {
  const fieldNames = new Set();
  Object.keys(schema.paths).forEach((key) => {
    if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;
    const topLevel = key.split('.')[0];
    fieldNames.add(topLevel);
  });
  return Array.from(fieldNames);
}

/**
 * Valida se o mapping fornecido cobre todos os campos do model.
 * Retorna um array com os nomes dos campos que estiverem faltando.
 */
function validateModelMapping(model, modelName, mapping) {
  const fields = getSchemaFieldNames(model.schema);
  const missing = fields.filter((field) => !(field in mapping));
  if (missing.length > 0) {
    console.error(
      `Model ${modelName} está faltando mapeamento para os campos: ${missing.join(', ')}`
    );
  } else {
    // console.log(`Model ${modelName} possui mapeamento para todos os campos.`);
  }
  return missing;
}

/**
 * Executa a validação para os models fornecidos, utilizando o mapping específico de cada um.
 */
async function validateAllMappings() {
  const models = await loadModels();
  let totalMissing = {};

  models.forEach(({ model, name }) => {
    // Combina os campos comuns com os específicos de cada model
    const mapping = {
      ...fakeMappings.common,
      ...(fakeMappings[name] || {}),
    };
    const missing = validateModelMapping(model, name, mapping);
    if (missing.length > 0) {
      totalMissing[name] = missing;
    }
  });

  if (Object.keys(totalMissing).length === 0) {
    console.log('globalFakeMapping cobre todos os campos de todos os models.');
    return true;
  } else {
    console.warn('Faltam mapeamentos para os seguintes models:', totalMissing);
    return false;
  }
}

// Executa a validação antes de prosseguir com o seeding ou outras operações
validateAllMappings()
  .then((valid) => {
    if (valid) {
      // Prossegue com o seeding ou outras operações
      console.log('Podemos acessar globalFakeMapping com segurança.');
    } else {
      throw new Error('globalFakeMapping não possui todos os mapeamentos necessários.');
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export default getGlobalFakeMapping;
