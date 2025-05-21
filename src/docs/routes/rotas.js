import commonResponses from "../schemas/swaggerCommonResponses.js";
import RoutesSchemas from "../schemas/rotasSchema.js";
import { generateParameters } from "./utils/generateParameters.js";

const filteredRoutes = {
  ...RoutesSchemas.RotaFiltro,
  properties: Object.fromEntries(
    Object.entries(RoutesSchemas.RotaFiltro.properties).filter(([key]) => key !== "_id" && key !== "rota")
  )
};

const rotasRoutes = {
  "/rotas": {
    get: {
      tags: ["Rotas"],
      summary: "Lista todas as rotas",
      description: "Retorna uma lista paginada de rotas com informações detalhadas.",
      security: [{ bearerAuth: [] }],
      parameters: generateParameters(filteredRoutes),
      responses: {
        200: commonResponses[200]("#/components/schemas/RotaListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Rotas"],
      summary: "Cria uma nova rota.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RotaPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/RotaDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/rotas/{id}": {
    patch: {
      tags: ["Rotas"],
      summary: "Atualiza uma rota.",
      description: "Atualiza os dados de uma rota específica pelo ID.",
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
              $ref: "#/components/schemas/RotaPutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/RotaDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Rotas"],
      summary: "Deleta uma rota.",
      description: "Remove uma rota específica pelo ID.",
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

export default rotasRoutes;