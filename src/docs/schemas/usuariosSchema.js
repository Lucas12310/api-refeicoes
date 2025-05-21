import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import Usuario from '../../models/Usuario.js';


import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

mongooseSchemaJsonSchema(mongoose);

const UsuarioJsonSchema = Usuario.schema.jsonSchema();

delete UsuarioJsonSchema.properties.__v;

const UsuarioSchemas = {
    UsuarioFiltro: {
    title: "UsuarioFiltro", 
    type: "object",
    properties: {
      _id: { type: "string" },
      nome: { type: "string" },
      email: { type: "string" },
      ativo: { type: "string" },
      pagina: { type: "string" },
    },
  },
  UsuarioListagemPaginada: {
    title: "UsuarioListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/UsuarioListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de refeições por turma."
  },
  UsuarioListagem: {
    ...deepCopy(UsuarioJsonSchema),
    description: "Schema para listagem de usuários"
  },
  UsuarioDetalhes: {
    ...deepCopy(UsuarioJsonSchema),
    description: "Schema para detalhes de um usuário"
  },
  UsuarioPost: {
    ...deepCopy(UsuarioJsonSchema),
    description: "Schema para criação de usuário"
  },
  UsuarioPutPatch: {
    ...deepCopy(UsuarioJsonSchema),
    required: [],
    description: "Schema para atualização de usuário"
  }
};

const removalMapping = {
  UsuarioListagem: ['__v'],
  UsuarioDetalhes: ['__v'],
  UsuarioPost: ['createdAt', 'updatedAt', '__v', '_id'],
  UsuarioPutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
};

Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (UsuarioSchemas[schemaKey]) {
    removeFieldsRecursively(UsuarioSchemas[schemaKey], fields);
  }
});

const UsuarioMongooseSchema = Usuario.schema;

UsuarioSchemas.UsuarioListagem.example = await generateExample(UsuarioSchemas.UsuarioListagem, null, UsuarioMongooseSchema);
UsuarioSchemas.UsuarioDetalhes.example = await generateExample(UsuarioSchemas.UsuarioDetalhes, null, UsuarioMongooseSchema);
UsuarioSchemas.UsuarioPost.example = await generateExample(UsuarioSchemas.UsuarioPost, null, UsuarioMongooseSchema);
UsuarioSchemas.UsuarioPutPatch.example = await generateExample(UsuarioSchemas.UsuarioPutPatch, null, UsuarioMongooseSchema);

export default UsuarioSchemas;
