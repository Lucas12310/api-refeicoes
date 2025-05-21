import usuariosSchemas from "../schemas/usuariosSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import { generateParameters } from "./utils/generateParameters.js"; // ajuste o caminho conforme necessário

//AQUI REMOVE O CAMPO _ID DO FILTRO, POIS NÃO QUEREMOS QUE O USUÁRIO CONSIGA FILTRAR PELO ID, APENAS PELOS CAMPOS QUE ESTÃO NO FILTRO
const filteredUsuariosFiltro = {
  ...usuariosSchemas.UsuarioFiltro,
  properties: Object.fromEntries(
    Object.entries(usuariosSchemas.UsuarioFiltro.properties).filter(([key]) => key !== "_id")
  )
};

const usuariosRoutes = {
  "/usuarios": {
    get: {
      tags: ["Usuarios"],
      summary: "Lista todos os usuários.",
      description: "Essa rota serve para listar todos os usuarios cadastrados.",
      security: [{ bearerAuth: [] }],
      // Gerando os parâmetros a partir do JSON Schema recursivamente
      parameters: generateParameters(filteredUsuariosFiltro),// Aqui é onde colocamos a constante que geramos acima
      responses: {
        200: commonResponses[200]("#/components/schemas/UsuarioListagemPaginada"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    post: {
      tags: ["Usuarios"],
      summary: "Cria um novo usuario.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UsuarioPost"
            }
          }
        }
      },
      responses: {
        201: commonResponses[201]("#/components/schemas/UsuarioDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    }
  },
  "/usuarios/{id}": {
    get: {
      tags: ["Usuarios"],
      summary: "Obtém detalhes de um usuário",
      description: "Essa rota serve para trazer um usuário pelo id",
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
        200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    put: {
      tags: ["Usuarios"],
      summary: "Atualiza um usuário.",
      description: "Essa rota serve para atualizar informação de um usuário",
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
              $ref: "#/components/schemas/UsuarioPutPatch"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/UsuarioDetalhes"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        409: commonResponses[409](),
        498: commonResponses[498](),
        500: commonResponses[500]()
      }
    },
    delete: {
      tags: ["Usuarios"],
      summary: "Deleta um usuário.",
      description: "Essa rota serve para deletar um usuário",
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

export default usuariosRoutes;
