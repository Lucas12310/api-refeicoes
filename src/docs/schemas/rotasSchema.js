import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import Rota from '../../models/Rota.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// Registra o plugin para que o Mongoose ganhe o método jsonSchema()
mongooseSchemaJsonSchema(mongoose);

// Gera o JSON Schema a partir dos schemas dos modelos
const rotaJsonSchema = Rota.schema.jsonSchema();

// Remove campos que não queremos na base original
delete rotaJsonSchema.properties.__v;

// Componha os diferentes contratos da sua API utilizando cópias profundas dos schemas
const rotasSchemas = {
  RotaFiltro: {
    title: "RotaFiltro",
    type: "object",
    properties: {
      _id: { type: "string" },
      nome: { type: "string" },
      rota: { type: ["string"] },
      pagina: { type: "string" },
    },
  },
  RotaListagemPaginada: {
    title: "RotaListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/RotaListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de rotas."
  },
  RotaListagem: {
    ...deepCopy(rotaJsonSchema),
    description: "Schema para listagem de rotas"
  },
  RotaDetalhes: {
    ...deepCopy(rotaJsonSchema),
    description: "Schema para detalhes de uma rota"
  },
  RotaPost: {
    ...deepCopy(rotaJsonSchema),
    description: "Schema para criação de rota"
  },
  RotaPutPatch: {
    ...deepCopy(rotaJsonSchema),
    required: [],
    description: "Schema para atualização de rota"
  }
};

// Mapeamento para definir, de forma individual, quais campos serão removidos de cada schema
const removalMapping = {
  RotaListagem: ['__v'],
  RotaDetalhes: ['__v'],
  RotaPost: ['createdAt', 'updatedAt', '__v', '_id'],
  RotaPutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
};

// Aplica a remoção de campos de forma individual a cada schema
Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (rotasSchemas[schemaKey]) {
    removeFieldsRecursively(rotasSchemas[schemaKey], fields);
  }
});

// Utiliza o schema do Mongoose para detectar referências automaticamente
const rotaMongooseSchema = Rota.schema;

// Gera os exemplos automaticamente para cada schema, passando o schema do Mongoose para detecção de referências
rotasSchemas.RotaListagem.example = await generateExample(rotasSchemas.RotaListagem, null, rotaMongooseSchema);
rotasSchemas.RotaDetalhes.example = await generateExample(rotasSchemas.RotaDetalhes, null, rotaMongooseSchema);
rotasSchemas.RotaPost.example = await generateExample(rotasSchemas.RotaPost, null, rotaMongooseSchema);
rotasSchemas.RotaPutPatch.example = await generateExample(rotasSchemas.RotaPutPatch, null, rotaMongooseSchema);

export default rotasSchemas;