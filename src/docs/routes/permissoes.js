import commonResponses from "../schemas/swaggerCommonResponses.js";

const permissoesRoutes = {
  "/permissoes": {
    get: {
      tags: ["Permissões"],
      summary: "Lista todas as permissões",
      description: "Retorna uma lista paginada de permissões com informações detalhadas, incluindo grupo e rota associados.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "rota",
          in: "query",
          required: false,
          schema: {
            type: "String",
            example: "refeições"
          },
          description: "Pesquisa pelo nome da rota."
        },
        {
          name: "grupo",
          in: "query",
          required: false,
          schema: {
            type: "String",
            example: "Admin"
          },
          description: "Pesquisa pelo nome do grupo."
        },
        {
          name: "pagina",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            example: 1
          },
          description: "Número da página a ser retornada."
        }
      ],
      responses: {
        200: commonResponses[200]("#/components/schemas/PermissoesListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Permissões"],
      summary: "Cria uma nova permissão.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/PermissoesPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/PermissoesDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
  },
"/permissoes/{id}": {
  patch: {
    tags: ["Permissões"],
      summary: "Atualiza uma permissão.",
        description: "Atualiza os dados de uma permissão específica pelo ID.",
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
            $ref: "#/components/schemas/PermissoesPutPatch"
          }
        }
      }
    },
    responses: {
      200: commonResponses[200]("#/components/schemas/PermissoesDetalhes"),
        400: commonResponses[400](),
          401: commonResponses[401](),
            404: commonResponses[404](),
              409: commonResponses[409](),
                498: commonResponses[498](),
                  500: commonResponses[500]()
    }
  },
  delete: {
    tags: ["Permissões"],
      summary: "Deleta uma permissão.",
        description: "Remove uma permissão específica pelo ID.",
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

export default permissoesRoutes;