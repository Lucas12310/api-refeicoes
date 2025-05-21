import estagioSchemas from "../schemas/estagiosSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js"; // ajuste o caminho conforme necessário

//AQUI REMOVE O CAMPO _ID DO FILTRO, POIS NÃO QUEREMOS QUE O USUÁRIO CONSIGA FILTRAR PELO ID, APENAS PELOS CAMPOS QUE ESTÃO NO FILTRO
const filteredEstagiosFiltro = {
  ...estagioSchemas.EstagioFiltro,
  properties: Object.fromEntries(
    Object.entries(estagioSchemas.EstagioFiltro.properties).filter(([key]) => key !== "_id")
  )
};

const estagiosRoutes = {
  "/estagios": {
    get: {
      tags: ["Estagios"],
      summary: "Lista todos os estagios",
      description: "Rota fundamental para a geração de relatório.",
      security: [{ bearerAuth: [] }],
      // Gerando os parâmetros a partir do JSON Schema recursivamente
      parameters: generateParameters(filteredEstagiosFiltro),// Aqui é onde colocamos a constante que geramos acima
      responses: {
        200: commonResponses[200]("#/components/schemas/EstagioListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Estagios"],
      summary: "Cria um novo estagio.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/EstagioPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/EstagioDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/estagios/{id}": {
    get: {
      tags: ["Estagios"],
      summary: "Obtém detalhes de um estagio.",
      description: "Rota fundamental para a geração de relatório.",
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
        200: commonResponses[200]("#/components/schemas/EstagioDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    put: {
      tags: ["Estagios"],
      summary: "Atualiza um estagio.",
      description: "Rota fundamental para a geração de relatório.",
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
              $ref: "#/components/schemas/EstagioPutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/EstagioDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Estagios"],
      summary: "Deleta um estagio.",
      description: "Rota fundamental para a geração de relatório.",
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

export default estagiosRoutes;
