//routes
// import userPaths from "../routes/user.js";
import authPaths from "../routes/auth.js";
import estudantesPaths from "../routes/estudantes.js";
import estagiosPaths from "../routes/estagios.js";
import refeicoesTurmas from "../routes/refeicoesTurmas.js";
import permissoesPaths from "../routes/permissoes.js";
import rotaPaths from "../routes/rotas.js";
import gruposPaths from "../routes/grupos.js";
import refeicoesPaths from "../routes/refeicoes.js"
import projetosPaths from "../routes/projetos.js"
import cursosPaths from "../routes/cursos.js"
import turmasPaths from "../routes/turmas.js"
import usuariosPaths from "../routes/usuarios.js"

//schemas
// import userSchema from "../schemas/userSchemaDcs.js";
import authSchema from "../schemas/authSchema.js";
import estudantesSchema from "../schemas/estudantesSchema.js";
import estagiosSchema from "../schemas/estagiosSchema.js";
import refeicoesTurmasSchema from "../schemas/refeicoesTurmasSchema.js";
import permissoesSchema from "../schemas/permissoesSchema.js";
import rotasSchemas from "../schemas/rotasSchema.js";
import gruposSchemas from "../schemas/gruposSchema.js"; 
import projetosSchemas from "../schemas/projetosSchema.js"
import refeicoesSchema from "../schemas/refeicoesSchema.js"
import cursosSchema from "../schemas/cursosSchema.js"
import turmasSchemas from "../schemas/turmasSchema.js";
import usuariosSchemas from "../schemas/usuariosSchema.js"

// Função para definir as URLs do servidor dependendo do ambiente
const getServersInCorrectOrder = () => {
  const devUrl = { url: process.env.SWAGGER_DEV_URL || "http://localhost:3100" };
  const prodUrl = { url: process.env.SWAGGER_PROD_URL || "https://sistema-de-refeicoes-api.app.fslab.dev" };

  if (process.env.NODE_ENV === "production") return [prodUrl];
  else return [devUrl];
};

// Função para obter as opções do Swagger
const getSwaggerOptions = () => {
  return {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Refeições Back End",
        version: "1.0-alpha",
        description: "Esse é o back end para o sistema de refeições do IFRO - Campus Vilhena.<br>É necessário estar autenticado e enviar o token JWT no header Authorization.",
      },
      servers: getServersInCorrectOrder(),
      tags: [
        {
          name: "Autenticação",
          description: "Rota para autenticação."
        },
        {
          name: "Permissões",
          description: "Rota para gestão de permissões."
        },
        {
          name: "Rotas",
          description: "Rota para gestão de rotas."
        },
        {
          name: "Grupos",
          description: "Rota para gestão de grupos."
        },
        {
          name: "Estudantes",
          description: "Rota para gestão de estudantes."
        },
        {
          name: "Estagios",
          description: "Rota para gestão de estagios."
        },
        {
          name: "Refeições por turmas",
          description: "Rota para gestão de refeições por turma."
        },
        {

          name: "Refeições",
          description: "Rota para gestão de refeições"
        },
        {
          name: "Projetos",
          description: "Rota para gestão de projetos"
        },
        {
          name: "Cursos",
          description: "Rota para gestão de cursos"
        },
        {
          name: "Turmas",
          description: "Rota para gestão de Turmas"
        },
        {
          name: "Usuarios",
          description: "Rota para gestão de Usuarios"
        }
      ],
      paths: {
        //   ...userPaths,
        ...authPaths,
        ...permissoesPaths,
        ...rotaPaths,
        ...gruposPaths,
        ...estudantesPaths,
        ...estagiosPaths, 
        ...refeicoesTurmas,
        ...refeicoesPaths,
        ...projetosPaths,
        ...cursosPaths,
        ...turmasPaths,
        ...usuariosPaths
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        },
        schemas: {
          //   ...userSchema,
          ...authSchema,
          ...permissoesSchema,
          ...rotasSchemas,
          ...gruposSchemas,
          ...estudantesSchema, 
          ...estagiosSchema,
          ...refeicoesTurmasSchema,
          ...refeicoesSchema,
          ...projetosSchemas,
          ...cursosSchema,
          ...turmasSchemas,
          ...usuariosSchemas
        }
      },
      security: [{
        bearerAuth: []
      }]
    },
    apis: ["./src/routes/*.js"]
  };
};

export default getSwaggerOptions;