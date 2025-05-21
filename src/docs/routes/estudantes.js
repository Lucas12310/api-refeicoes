import estudantesSchemas from "../schemas/estudantesSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js"; // ajuste o caminho conforme necessário

//AQUI REMOVE O CAMPO _ID DO FILTRO, POIS NÃO QUEREMOS QUE O USUÁRIO CONSIGA FILTRAR PELO ID, APENAS PELOS CAMPOS QUE ESTÃO NO FILTRO
const filteredEstudanteFiltro = {
  ...estudantesSchemas.EstudanteFiltro,
  properties: Object.fromEntries(
    Object.entries(estudantesSchemas.EstudanteFiltro.properties).filter(([key]) => key !== "_id")
  )
};

const estudantesRoutes = {
  "/estudantes": {
    get: {
      tags: ["Estudantes"],
      summary: "Lista todos os estudantes",
      description: "Os dados do estudante deverão aparecer após ler o QRCODE. ",
      security: [{ bearerAuth: [] }],
      // Gerando os parâmetros a partir do JSON Schema recursivamente
      parameters: generateParameters(filteredEstudanteFiltro), //Aqui é onde colocamos a constante que geramos acima
      responses: {
        200: commonResponses[200]("#/components/schemas/EstudanteListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Estudantes"],
      summary: "Cria um novo estudante",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/EstudantePost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/EstudanteDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/estudantes/{id}": {
    get: {
      tags: ["Estudantes"],
      summary: "Obtém detalhes de um estudante",
      description: "Os dados do estudante deverão aparecer após ler o QRCODE. ",
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
        200: commonResponses[200]("#/components/schemas/EstudanteDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    put: {
      tags: ["Estudantes"],
      summary: "Atualiza um estudante",
      description: "Os dados do estudante deverão aparecer após ler o QRCODE. ",
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
              $ref: "#/components/schemas/EstudantePutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/EstudanteDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Estudantes"],
      summary: "Deleta um estudante",
      description: "Os dados do estudante deverão aparecer após ler o QRCODE. ",
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
  "/estudantes/inativar": {
    patch: {
      tags: ["Estudantes"],
      summary: "Inativa múltiplos estudantes",
      description: "Inativa estudantes com base nos dados enviados no corpo da requisição.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                confirmacao: { type: "boolean", example: true }
              },
              required: ["confirmacao"]
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/EstudanteListagem"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
};

export default estudantesRoutes;
