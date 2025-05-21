import commonResponses from "../schemas/swaggerCommonResponses.js";
import TurmasSchemas from "../schemas/turmasSchema.js";
import { generateParameters } from "./utils/generateParameters.js";

const filteredRoutes = {
  ...TurmasSchemas.TurmaFiltro,
  properties: Object.fromEntries(
    Object.entries(TurmasSchemas.TurmaFiltro.properties).filter(([key]) => key !== "_id" && key !== "rota")
  )
};

const turmasRoutes = {
  "/turmas": {
    get: {
      tags: ["Turmas"],
      summary: "Lista todas as turmas",
      description: "Retorna uma lista paginada de turmas com informações detalhadas.",
      security: [{ bearerAuth: [] }],
      parameters: generateParameters(filteredRoutes),
      responses: {
        200: commonResponses[200]("#/components/schemas/TurmaListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Turmas"],
      summary: "Cria uma nova turma.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/TurmaPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/TurmaDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/turmas/{id}": {
    patch: {
      tags: ["Turmas"],
      summary: "Atualiza uma turma.",
      description: "Atualiza os dados de uma turma específica pelo ID.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/TurmaPutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/TurmaDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Turmas"],
      summary: "Deleta uma turma.",
      description: "Remove uma turma específica pelo ID.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: commonResponses[200](),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  }
};

export default turmasRoutes;