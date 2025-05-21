import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import removeFieldsRecursively from '../../utils/removeFields.js';
import Curso from '../../models/Curso.js';
import { deepCopy, generateExample } from '../utils/schemaGenerate.js';

// Registra o plugin para que o Mongoose ganhe o método jsonSchema()
mongooseSchemaJsonSchema(mongoose);

// Gera o JSON Schema a partir dos schemas dos modelos
const cursoJsonSchema = Curso.schema.jsonSchema();

// Remove campos que não queremos na base original
delete cursoJsonSchema.properties.__v;

// Componha os diferentes contratos da sua API utilizando cópias profundas dos schemas
const cursosSchemas = {
  CursoFiltro: {
    title: "CursoFiltro",
    type: "object",
    properties: {
      _id: { type: "string" },
      nome: { type: "string" },
      codigo_suap: { type: "string" },
      contra_turno: { type: "string" },
      pagina: { type: "string" },
    },
  },
  CursoListagemPaginada: {
    title: "CursoListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/CursoListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de cursos."
  },
  CursoListagem: {
    ...deepCopy(cursoJsonSchema),
    description: "Schema para listagem de cursos"
  },
  CursoDetalhes: {
    ...deepCopy(cursoJsonSchema),
    description: "Schema para detalhes de um curso"
  },
  CursoPost: {
    ...deepCopy(cursoJsonSchema),
    description: "Schema para criação de cursos"
  },
  CursoPutPatch: {
    ...deepCopy(cursoJsonSchema),
    required: [],
    description: "Schema para atualização de cursos"
  }
};

// Mapeamento para definir, de forma individual, quais campos serão removidos de cada schema
const removalMapping = {
  CursoListagem: ['__v'],
  CursoDetalhes: ['__v'],
  CursoPost: ['createdAt', 'updatedAt', '__v', '_id'],
  CursoPutPatch: ['createdAt', 'updatedAt', '__v', '_id'],
};

// Aplica a remoção de campos de forma individual a cada schema
Object.entries(removalMapping).forEach(([schemaKey, fields]) => {
  if (cursosSchemas[schemaKey]) {
    removeFieldsRecursively(cursosSchemas[schemaKey], fields);
  }
});

// Utiliza o schema do Mongoose para detectar referências automaticamente
const cursoMongooseSchema = Curso.schema;

// Gera os exemplos automaticamente para cada schema, passando o schema do Mongoose para detecção de referências
cursosSchemas.CursoListagem.example = await generateExample(cursosSchemas.CursoListagem, null, cursoMongooseSchema);
cursosSchemas.CursoDetalhes.example = await generateExample(cursosSchemas.CursoDetalhes, null, cursoMongooseSchema);
cursosSchemas.CursoPost.example = await generateExample(cursosSchemas.CursoPost, null, cursoMongooseSchema);
cursosSchemas.CursoPutPatch.example = await generateExample(cursosSchemas.CursoPutPatch, null, cursoMongooseSchema);

export default cursosSchemas;