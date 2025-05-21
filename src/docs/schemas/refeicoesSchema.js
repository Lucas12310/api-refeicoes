import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import Refeicao from '../../models/Refeicao.js';


import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const RefeicaoJsonSchema = Refeicao.schema.jsonSchema();

delete RefeicaoJsonSchema.properties.__v;

const RefeicaoSchemas = {
    RefeicaoFiltro: {
    title: "RefeicaoFiltro", 
    type: "object",
    properties: {
      _id: { type: "string" },
      dataInicio: { type: "string" },
      dataTermino: { type: "string" },
      turma: { type: "string" },
      curso: { type: "string" },
      matricula: { type: "string" },
      nome: { type: "string" },
      tipoRefeicao: { type: "string" },
    },
  },
  RefeicaoListagemPaginada: {
    title: "RefeicaoListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/RefeicaoListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de refeições por turma."
  },
  RefeicaoListagem: {
    ...deepCopy(RefeicaoJsonSchema),
    description: "Schema de relatório gerado"
  },
  RefeicaoDetalhes: {
    ...deepCopy(RefeicaoJsonSchema),
    description: "Schema para detalhes de um usuário"
  },
  RefeicaoPost: {
    ...deepCopy(RefeicaoJsonSchema),
    description: "Schema para criação de usuário"
  }, 
};

const removalMapping = {
  RefeicaoListagem: ['__v'],
  RefeicaoDetalhes: ['__v'],
  RefeicaoPost: ['createdAt', 'updatedAt', '__v', '_id']  
};

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (RefeicaoSchemas[schemaKey]) {
    removeFieldsRecursively(RefeicaoSchemas[schemaKey], fields);
  }
});

const RefeicaoMongooseSchema = Refeicao.schema;

RefeicaoSchemas.RefeicaoListagem.example = await generateExample(RefeicaoSchemas.RefeicaoListagem, null, RefeicaoMongooseSchema);
RefeicaoSchemas.RefeicaoDetalhes.example = await generateExample(RefeicaoSchemas.RefeicaoDetalhes, null, RefeicaoMongooseSchema);
RefeicaoSchemas.RefeicaoPost.example = await generateExample(RefeicaoSchemas.RefeicaoPost, null, RefeicaoMongooseSchema);

export default RefeicaoSchemas;
