import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import RefeicaoTurma from '../../models/RefeicaoTurma.js';


import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const refeicaoTurmaJsonSchema = RefeicaoTurma.schema.jsonSchema();

delete refeicaoTurmaJsonSchema.properties.__v;

const refeicaoTurmaSchemas = {
    RefeicaoTurmaFiltro: {
    title: "RefeicaoTurmaFiltro", 
    type: "object",
    properties: {
      _id: { type: "string" },
      turma: { type: "string" },
      data_liberado: { type: "string" },
      descricao: { type: "string" },
      pagina: { type: "string" },
    },
  },
  RefeicaoTurmaListagemPaginada: {
    title: "RefeicaoTurmaListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/RefeicaoTurmaListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de refeições por turma."
  },
  RefeicaoTurmaListagem: {
    ...deepCopy(refeicaoTurmaJsonSchema),
    description: "Schema para listagem de usuários"
  },
  RefeicaoTurmaDetalhes: {
    ...deepCopy(refeicaoTurmaJsonSchema),
    description: "Schema para detalhes de um usuário"
  },
  RefeicaoTurmaPost: {
    ...deepCopy(refeicaoTurmaJsonSchema),
    description: "Schema para criação de usuário"
  },
  RefeicaoTurmaPutPatch: {
    ...deepCopy(refeicaoTurmaJsonSchema),
    required: [],
    description: "Schema para atualização de usuário"
  }
};

const removalMapping = {
  RefeicaoTurmaListagem: ['__v'],
  RefeicaoTurmaDetalhes: ['__v'],
  RefeicaoTurmaPost: ['createdAt', 'updatedAt', '__v', '_id'],
  RefeicaoTurmaPutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
};

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (refeicaoTurmaSchemas[schemaKey]) {
    removeFieldsRecursively(refeicaoTurmaSchemas[schemaKey], fields);
  }
});

const refeicaoTurmaMongooseSchema = RefeicaoTurma.schema;

refeicaoTurmaSchemas.RefeicaoTurmaListagem.example = await generateExample(refeicaoTurmaSchemas.RefeicaoTurmaListagem, null, refeicaoTurmaMongooseSchema);
refeicaoTurmaSchemas.RefeicaoTurmaDetalhes.example = await generateExample(refeicaoTurmaSchemas.RefeicaoTurmaDetalhes, null, refeicaoTurmaMongooseSchema);
refeicaoTurmaSchemas.RefeicaoTurmaPost.example = await generateExample(refeicaoTurmaSchemas.RefeicaoTurmaPost, null, refeicaoTurmaMongooseSchema);
refeicaoTurmaSchemas.RefeicaoTurmaPutPatch.example = await generateExample(refeicaoTurmaSchemas.RefeicaoTurmaPutPatch, null, refeicaoTurmaMongooseSchema);

export default refeicaoTurmaSchemas;
