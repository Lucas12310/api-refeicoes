import commonResponses from "../schemas/swaggerCommonResponses.js";
import CursosSchema from "../schemas/cursosSchema.js";
import { generateParameters } from "./utils/generateParameters.js";

const filteredRoutes = {
  ...CursosSchema.CursoFiltro,
  properties: Object.fromEntries(
    Object.entries(CursosSchema.CursoFiltro.properties).filter(([key]) => key !== "_id")
  )
};

const cursosRoutes = {
  "/cursos": {
    get: {
      tags: ["Cursos"],
      summary: "Lista todas os cursos",
      description: "Retorna uma lista paginada de cursos com informações detalhadas.",
      security: [{ bearerAuth: [] }],
      parameters: generateParameters(filteredRoutes),
      responses: {
        200: commonResponses[200]("#/components/schemas/CursoListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Cursos"],
      summary: "Cria um novo curso.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CursoPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/CursoDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/cursos/{id}": {
    patch: {
      tags: ["Cursos"],
      summary: "Atualiza um curso.",
      description: "Atualiza os dados de um curso específico pelo ID.",
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
              $ref: "#/components/schemas/CursoPutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/CursoDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Cursos"],
      summary: "Deleta um curso.",
      description: "Remove um curso específico pelo ID.",
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

export default cursosRoutes;