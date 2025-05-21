import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import Permissoes from '../../models/Permissoes.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// Registra o plugin para que o Mongoose ganhe o método jsonSchema()
mongooseSchemaJsonSchema(mongoose);

// Gera o JSON Schema a partir dos schemas dos modelos
const permissoesJsonSchema = Permissoes.schema.jsonSchema();

// Remove campos que não queremos na base original
delete permissoesJsonSchema.properties.__v;

// Componha os diferentes contratos da sua API utilizando cópias profundas dos schemas
const permissoesSchemas = {
  PermissoesFiltro: {
    title: "PermissoesFiltro",
    type: "object",
    properties: {
      _id: { type: "string" },
      metodos: { type: "string" },
      grupo_id: { type: "string" },
      rota_id: { type: "string" },
      pagina: { type: "string" },
    },
  },
  PermissoesListagemPaginada: {
    title: "PermissoesListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/PermissoesListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de permissões."
  },
  PermissoesListagem: {
    ...deepCopy(permissoesJsonSchema),
    description: "Schema para listagem de permissões"
  },
  PermissoesDetalhes: {
    ...deepCopy(permissoesJsonSchema),
    description: "Schema para detalhes de uma permissão"
  },
  PermissoesPost: {
    ...deepCopy(permissoesJsonSchema),
    description: "Schema para criação de permissão"
  },
  PermissoesPutPatch: {
    ...deepCopy(permissoesJsonSchema),
    required: [],
    description: "Schema para atualização de permissão"
  }
};

// Mapeamento para definir, de forma individual, quais campos serão removidos de cada schema
const removalMapping = {
  PermissoesListagem: ['__v'],
  PermissoesDetalhes: ['__v'],
  PermissoesPost: ['createdAt', 'updatedAt', '__v', '_id'],
  PermissoesPutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
};

// Aplica a remoção de campos de forma individual a cada schema
Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (permissoesSchemas[schemaKey]) {
    removeFieldsRecursively(permissoesSchemas[schemaKey], fields);
  }
});

// Utiliza o schema do Mongoose para detectar referências automaticamente
const permissoesMongooseSchema = Permissoes.schema;

// Gera os exemplos automaticamente para cada schema, passando o schema do Mongoose para detecção de referências
permissoesSchemas.PermissoesListagem.example = await generateExample(permissoesSchemas.PermissoesListagem, null, permissoesMongooseSchema);
permissoesSchemas.PermissoesDetalhes.example = await generateExample(permissoesSchemas.PermissoesDetalhes, null, permissoesMongooseSchema);
permissoesSchemas.PermissoesPost.example = await generateExample(permissoesSchemas.PermissoesPost, null, permissoesMongooseSchema);
permissoesSchemas.PermissoesPutPatch.example = await generateExample(permissoesSchemas.PermissoesPutPatch, null, permissoesMongooseSchema);

export default permissoesSchemas;