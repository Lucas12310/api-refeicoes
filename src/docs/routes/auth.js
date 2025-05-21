import commonResponses from "../schemas/swaggerCommonResponses.js";

const authRoutes = {
  "/login": {
    post: {
      tags: ["Autenticação"],
      summary: "Realiza o login do usuário",
      description: "Autentica o usuário e retorna um token de acesso (JWT) e um token de atualização.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/LoginResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        500: commonResponses[500]()
      }
    }
  },
  "/logout": {
    post: {
      tags: ["Autenticação"],
      summary: "Realiza o logout do usuário",
      description: "Remove os tokens de acesso e atualização do usuário.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LogoutRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/LogoutResponse"),
        400: commonResponses[400](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  },
  "/refresh-token": {
    post: {
      tags: ["Autenticação"],
      summary: "Atualiza os tokens do usuário",
      description: "Gera um novo token de acesso (JWT) com base no token de atualização fornecido.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RefreshTokenRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/RefreshTokenResponse"),
        400: commonResponses[400](),
        401: commonResponses[401](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  },
  "/revoke-token": {
    post: {
      tags: ["Autenticação"],
      summary: "Revoga o token de atualização do usuário",
      description: "Remove o token de atualização (refresh token) associado ao usuário, invalidando futuras requisições de atualização de tokens.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RevokeTokenRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200]("#/components/schemas/RevokeTokenResponse"),
        400: commonResponses[400](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  },
  "/forgot-password": {
    post: {
      tags: ["Autenticação"],
      summary: "Solicita a recuperação de senha",
      description: "Envia um código de recuperação de senha para o e-mail do usuário.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ForgotPasswordRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200](),
        400: commonResponses[400](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  },
  "/reset-password": {
    post: {
      tags: ["Autenticação"],
      summary: "Redefine a senha do usuário",
      description: "Permite redefinir a senha do usuário utilizando um código de recuperação válido.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ResetPasswordRequest"
            }
          }
        }
      },
      responses: {
        200: commonResponses[200](),
        400: commonResponses[400](),
        404: commonResponses[404](),
        500: commonResponses[500]()
      }
    }
  }
};

export default authRoutes;