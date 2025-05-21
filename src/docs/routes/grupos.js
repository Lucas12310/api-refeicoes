import commonResponses from "../schemas/swaggerCommonResponses.js";
import GroupsSchemas from "../schemas/gruposSchema.js";
import { generateParameters } from "./utils/generateParameters.js";

const filteredGroups = {
  ...GroupsSchemas.GruposFiltro,
  properties: Object.fromEntries(
    Object.entries(GroupsSchemas.GruposFiltro.properties).filter(([key]) => key !== "_id")
  )
};

const GruposRoutes = {
  "/grupos": {
    get: {
      tags: ["Grupos"],
      summary: "Lista todas os grupos",
      description: "Retorna uma lista paginada de grupos com informações detalhadas. Grupos são entidades que podem conter permissões diferentes.",
      security: [{ bearerAuth: [] }],
      parameters: generateParameters(filteredGroups),
      responses: {
        200: commonResponses[200]("#/components/schemas/GruposListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Grupos"],
      summary: "Cria um novo estudante",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/GruposPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/GruposListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/grupos/{id}": {
    patch: {
      tags: ["Grupos"],
      summary: "Atualiza um grupo",
      description: "Atualizará um grupo específico.",
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
              $ref: "#/components/schemas/GruposPutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/GruposListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Grupos"],
      summary: "Deleta um grupo",
      description: "Deleta um grupo com base no seu id.",
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
  },
};

export default GruposRoutes;