import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import Grupos from '../../models/Grupo.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// Registra o plugin para que o Mongoose ganhe o método jsonSchema()
mongooseSchemaJsonSchema(mongoose);

// Gera o JSON Schema a partir dos schemas dos modelos
const gruposJsonSchema = Grupos.schema.jsonSchema();

// Remove campos que não queremos na base original
delete gruposJsonSchema.properties.__v;

// Componha os diferentes contratos da sua API utilizando cópias profundas dos schemas
const gruposSchemas = {
  GruposFiltro: {
    title: "GruposFiltro",
    type: "object",
    properties: {
      _id: { type: "string" },
      nome: { type: "string" },
      pagina: { type: "string" },
    },
  },
  GruposListagemPaginada: {
    title: "GruposListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/GruposListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de grupos."
  },
  GruposListagem: {
    ...deepCopy(gruposJsonSchema),
    description: "Schema para listagem de grupos"
  },
  GruposDetalhes: {
    ...deepCopy(gruposJsonSchema),
    description: "Schema para detalhes de um grupo"
  },
  GruposPost: {
    ...deepCopy(gruposJsonSchema),
    description: "Schema para criação de grupos"
  },
  GruposPutPatch: {
    ...deepCopy(gruposJsonSchema),
    required: [],
    description: "Schema para atualização de grupos"
  }
};

// Mapeamento para definir, de forma individual, quais campos serão removidos de cada schema
const removalMapping = {
  GruposListagem: ['__v'],
  GruposDetalhes: ['__v'],
  GruposPost: ['createdAt', 'updatedAt', '__v', '_id'],
  GruposPutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
};

// Aplica a remoção de campos de forma individual a cada schema
Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (gruposSchemas[schemaKey]) {
    removeFieldsRecursively(gruposSchemas[schemaKey], fields);
  }
});

// Utiliza o schema do Mongoose para detectar referências automaticamente
const gruposMongooseSchema = Grupos.schema;

// Gera os exemplos automaticamente para cada schema, passando o schema do Mongoose para detecção de referências
gruposSchemas.GruposListagem.example = await generateExample(gruposSchemas.GruposListagem, null, gruposMongooseSchema);
gruposSchemas.GruposDetalhes.example = await generateExample(gruposSchemas.GruposDetalhes, null, gruposMongooseSchema);
gruposSchemas.GruposPost.example = await generateExample(gruposSchemas.GruposPost, null, gruposMongooseSchema);
gruposSchemas.GruposPutPatch.example = await generateExample(gruposSchemas.GruposPutPatch, null, gruposMongooseSchema);

export default gruposSchemas;