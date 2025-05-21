import commonResponses from "../schemas/swaggerCommonResponses.js";
import ProjetosSchemas from "../schemas/projetosSchema.js";
import { generateParameters } from "./utils/generateParameters.js";

const filteredRoutes = {
  ...ProjetosSchemas.ProjetoFiltro,
  properties: Object.fromEntries(
    Object.entries(ProjetosSchemas.ProjetoFiltro.properties).filter(([key]) => key !== "_id")
  )
};

const projetosRoutes = {
  "/projetos": {
    get: {
      tags: ["Projetos"],
      summary: "Lista todos os projetos",
      description: "Retorna uma lista paginada de projetos com informações detalhadas.",
      security: [{ bearerAuth: [] }],
      parameters: generateParameters(filteredRoutes),
      responses: {
        200: commonResponses[200]("#/components/schemas/ProjetoListagem"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Projetos"],
      summary: "Cria um novo projeto.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ProjetoPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/ProjetoDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/projetos/{id}": {
    patch: {
      tags: ["Projetos"],
      summary: "Atualiza um projeto.",
      description: "Atualiza os dados de um projeto específico pelo ID.",
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
              $ref: "#/components/schemas/ProjetoPutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/ProjetoDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Projetos"],
      summary: "Deleta um projeto",
      description: "Remove um projeto específica pelo ID.",
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

export default projetosRoutes;