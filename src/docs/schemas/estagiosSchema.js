// schemas/estagiosSchemas.js
import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import Estagio from '../../models/Estagio.js';


// Importa as funções utilitárias separadas
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// Registra o plugin para que o Mongoose ganhe o método jsonSchema()
/**
 * @mongooseSchemaJsonSchema eLE GERA O JSON SCHEMA A PARTIR DO SCHEMA DO MONGOOSE, O QUE É MUITO ÚTIL PARA VALIDAR OS DADOS ENVIADOS NA REQUISIÇÃO.
 * O JSON SCHEMA É UM FORMATO PADRÃO PARA DESCREVER E VALIDAR ESTRUTURAS DE DADOS EM JSON.
 * EXEMPLO:
 * {
 *  "type": "object",
 *  "properties": {
 *    "name": { "type": "string" },
 *    "age": { "type": "number", "minimum": 0 }
 *   },
 *   "required": ["name"]
 * }
 */
mongooseSchemaJsonSchema(mongoose);

// Gera o JSON Schema a partir dos schemas dos modelos
const estagioJsonSchema = Estagio.schema.jsonSchema();

// Remove campos que não queremos na base original
delete estagioJsonSchema.properties.__v;

// Componha os diferentes contratos da sua API utilizando cópias profundas dos schemas
const estagiosSchemas = {
    EstagioFiltro: {
    title: "EstagioFiltro", 
    type: "object",
    properties: {
      _id: { type: "string" },
      turnos: { type: "string" },
      estudante: { type: "string" },
      data_inicio: { type: "string" },
      data_termino: { type: "string" },
      descricao: { type: "string" },
      status: { type: "string" },
      pagina: { type: "string" },
    },
  },
  EstagioListagemPaginada: {
    title: "EstagioListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/EstagioListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de estagios."
  },
  EstagioListagem: {
    ...deepCopy(estagioJsonSchema),
    description: "Schema para listagem de usuários"
  },
  EstagioDetalhes: {
    ...deepCopy(estagioJsonSchema),
    description: "Schema para detalhes de um usuário"
  },
  EstagioPost: {
    ...deepCopy(estagioJsonSchema),
    description: "Schema para criação de usuário"
  },
  EstagioPutPatch: {
    ...deepCopy(estagioJsonSchema),
    required: [],
    description: "Schema para atualização de usuário"
  }
};

// Mapeamento para definir, de forma individual, quais campos serão removidos de cada schema
const removalMapping = {
  EstagioListagem: ['__v'],
  EstagioDetalhes: ['__v'],
  EstagioPost: ['createdAt', 'updatedAt', '__v', '_id'],
  EstagioPutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
};

// Aplica a remoção de campos de forma individual a cada schema
Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (estagiosSchemas[schemaKey]) {
    removeFieldsRecursively(estagiosSchemas[schemaKey], fields);
  }
});

// Utiliza o schema do Mongoose para detectar referências automaticamente
const estagioMongooseSchema = Estagio.schema;

// Gera os exemplos automaticamente para cada schema, passando o schema do Mongoose para detecção de referências
estagiosSchemas.EstagioListagem.example = await generateExample(estagiosSchemas.EstagioListagem, null, estagioMongooseSchema);
estagiosSchemas.EstagioDetalhes.example = await generateExample(estagiosSchemas.EstagioDetalhes, null, estagioMongooseSchema);
estagiosSchemas.EstagioPost.example = await generateExample(estagiosSchemas.EstagioPost, null, estagioMongooseSchema);
estagiosSchemas.EstagioPutPatch.example = await generateExample(estagiosSchemas.EstagioPutPatch, null, estagioMongooseSchema);

export default estagiosSchemas;
