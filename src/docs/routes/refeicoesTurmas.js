import refeicoesTurmasSchemas from "../schemas/refeicoesTurmasSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js"; // ajuste o caminho conforme necessário

//AQUI REMOVE O CAMPO _ID DO FILTRO, POIS NÃO QUEREMOS QUE O USUÁRIO CONSIGA FILTRAR PELO ID, APENAS PELOS CAMPOS QUE ESTÃO NO FILTRO
const filteredRefeicoesTurmasFiltro = {
  ...refeicoesTurmasSchemas.RefeicaoTurmaFiltro,
  properties: Object.fromEntries(
    Object.entries(refeicoesTurmasSchemas.RefeicaoTurmaFiltro.properties).filter(([key]) => key !== "_id")
  )
};

const refeicoesTurmasRoutes = {
  "/refeicoes-turmas": {
    get: {
      tags: ["Refeições por turmas"],
      summary: "Lista todas as refeições por turma.",
      description: "Essa rota serve para trazer uma refeição atípica para cada turma.",
      security: [{ bearerAuth: [] }],
      // Gerando os parâmetros a partir do JSON Schema recursivamente
      parameters: generateParameters(filteredRefeicoesTurmasFiltro),// Aqui é onde colocamos a constante que geramos acima
      responses: {
        200: commonResponses[200]("#/components/schemas/RefeicaoTurmaListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Refeições por turmas"],
      summary: "Cria uma nova refeição por turma.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RefeicaoTurmaPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/RefeicaoTurmaDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/refeicoes-turmas/{id}": {
    get: {
      tags: ["Refeições por turmas"],
      summary: "Obtém detalhes de uma refeição por turma.",
      description: "Essa rota serve para trazer uma refeição atípica para cada turma.",
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
        200: commonResponses[200]("#/components/schemas/RefeicaoTurmaDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    put: {
      tags: ["Refeições por turmas"],
      summary: "Atualiza uma refeição por turma.",
      description: "Essa rota serve para trazer uma refeição atípica para cada turma.",
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
              $ref: "#/components/schemas/RefeicaoTurmaPutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/RefeicaoTurmaDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Refeições por turmas"],
      summary: "Deleta uma refeição por turma.",
      description: "Essa rota serve para trazer uma refeição atípica para cada turma.",
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

export default refeicoesTurmasRoutes;
