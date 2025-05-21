import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import Projeto from '../../models/Projeto.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// Registra o plugin para que o Mongoose ganhe o método jsonSchema()
mongooseSchemaJsonSchema(mongoose);

// Gera o JSON Schema a partir dos schemas dos modelos
const ProjetoJsonSchema = Projeto.schema.jsonSchema();

// Remove campos que não queremos na base original
delete ProjetoJsonSchema.properties.__v;

// Componha os diferentes contratos da sua API utilizando cópias profundas dos schemas
const projetosSchema = {
  ProjetoFiltro: {
    title: "ProjetoFiltro",
    type: "object",
    properties: {
      _id: { type: "string" },
      nome: { type: "string" },
      estudantes: { type: ["string"] },
      data_inicio: { type: "string" },
      data_termino: { type: "string" },
      turnos: {type: "Boolean"}
    },
  },
  ProjetoListagem: {
    ...deepCopy(ProjetoJsonSchema),
    description: "Schema para listagem de projetos"
  },
  ProjetoDetalhes: {
    ...deepCopy(ProjetoJsonSchema),
    description: "Schema para listagem de projetos"
  },
  ProjetoPost: {
    ...deepCopy(ProjetoJsonSchema),
    description: "Schema para criação de projeto"
  },
  ProjetoPutPatch: {
    ...deepCopy(ProjetoJsonSchema),
    required: [],
    description: "Schema para atualização de projeto"
  }
};

// Mapeamento para definir, de forma individual, quais campos serão removidos de cada schema
const removalMapping = {

  ProjetoPost: ['createdAt', 'updatedAt', '__v', '_id'],
  ProjetoPutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
};

// Aplica a remoção de campos de forma individual a cada schema
Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (projetosSchema[schemaKey]) {
    removeFieldsRecursively(projetosSchema[schemaKey], fields);
  }
});

// Utiliza o schema do Mongoose para detectar referências automaticamente
const projetoMongooseSchema = Projeto.schema;

// Gera os exemplos automaticamente para cada schema, passando o schema do Mongoose para detecção de referências
projetosSchema.ProjetoListagem.example = await generateExample(projetosSchema.ProjetoListagem, null, projetoMongooseSchema);
projetosSchema.ProjetoDetalhes.example = await generateExample(projetosSchema.ProjetoDetalhes, null, projetoMongooseSchema);
projetosSchema.ProjetoPost.example = await generateExample(projetosSchema.ProjetoPost, null, projetoMongooseSchema);
projetosSchema.ProjetoPutPatch.example = await generateExample(projetosSchema.ProjetoPutPatch, null, projetoMongooseSchema);

export default projetosSchema;