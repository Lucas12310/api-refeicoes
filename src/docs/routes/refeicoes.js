import refeicoesSchemas from "../schemas/refeicoesSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js";

// Remove o campo _id do filtro, pois não queremos que o usuário consiga filtrar pelo ID
const filteredRefeicoesFiltro = {
  ...refeicoesSchemas.RefeicaoFiltro,
  properties: Object.fromEntries(
    Object.entries(refeicoesSchemas.RefeicaoFiltro.properties).filter(([key]) => key !== "_id")
  ),
};

const refeicoesRoutes = {
  "/refeicoes": {
    get: {
      tags: ["Refeições"],
      summary: "Gera o relatório de refeições",
      description: `
        Este endpoint gera um relatório com todas as refeições registradas com base nos filtros fornecidos.
        Os filtros disponíveis incluem:
        - **dataInicio** e **dataTermino**: Intervalo de datas para o relatório.
        - **matricula**: Filtra refeições de um estudante específico.
        - **nome**: Filtra refeições pelo nome do estudante.
        - **curso**: Filtra refeições pelo curso do estudante.
        - **turma**: Filtra refeições pela turma do estudante.
        - **tipoRefeicao**: Filtra refeições pelo tipo (e.g., Contra-turno, Projeto, Estágio, Turma).
      `,
      security: [{ bearerAuth: [] }],
      parameters: generateParameters(filteredRefeicoesFiltro), // Gera os parâmetros com base no filtro ajustado
      responses: {
        200: commonResponses[200]("#/components/schemas/RefeicaoListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500](),
      },
    },
    post: {
      tags: ["Refeições"],
      summary: "Registra a refeição de um estudante",
      description: `
        Este endpoint registra uma refeição para um estudante com base na matrícula fornecida.
        O sistema verifica automaticamente se o estudante está ativo, se já almoçou no dia e se atende aos critérios para almoçar, como:
        - Participação em contra-turnos.
        - Participação em projetos ou estágios em andamento.
        - Liberação especial para a turma.
        
        Caso o estudante não atenda aos critérios ou já tenha almoçado, o registro será negado.
      `,
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                matricula: {
                  type: "string",
                  description: "Matrícula do estudante que está almoçando.",
                  example: "20230012345",
                },
              },
              required: ["matricula"],
            },
          },
        },
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/RefeicaoPost"),
        400: {
          description: "Erro de validação ou regra de negócio.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Estudante já almoçou hoje!" },
                  code: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
        401: commonResponses[401](),
        404: {
          description: "Estudante não encontrado ou não pode almoçar.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Estudante não pode almoçar hoje" },
                  code: { type: "integer", example: 404 },
                },
              },
            },
          },
        },
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500](),
      },
    },
  },
};

export default refeicoesRoutes;