const authSchemas = {
  LoginRequest: {
    title: "LoginRequest",
    type: "object",
    properties: {
      email: {
        type: "string",
        example: "admin@gmail.com",
        description: "E-mail do usuário."
      },
      senha: {
        type: "string",
        example: "Admin123@abc",
        description: "Senha do usuário."
      }
    },
    required: ["email", "senha"],
    description: "Schema para a requisição de login."
  },
  LoginResponse: {
    title: "LoginResponse",
    type: "object",
    properties: {
      accessToken: {
        type: "string",
        description: "Token de acesso (JWT)."
      },
      refreshToken: {
        type: "string",
        description: "Token de atualização."
      },
      usuario: {
        type: "object",
        description: "Dados do usuário autenticado.",
        properties: {
          _id: { type: "string" },
          nome: { type: "string" },
          email: { type: "string" },
          ativo: { type: "boolean" },
          refreshToken: { type: "string" },
          accessToken: { type: "string" }
        }
      }
    },
    description: "Schema para a resposta de login.",
    example: {
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      usuario: {
        _id: "67ffcf9807d44aa7509711e8",
        nome: "Admin",
        email: "admin@gmail.com",
        ativo: true,
      }
    }
  },
  LogoutRequest: {
    title: "LogoutRequest",
    type: "object",
    properties: {
      userId: {
        type: "string",
        example: "67ffcf9807d44aa7509711e8",
        description: "ID do usuário que está realizando o logout."
      }
    },
    required: ["userId"],
    description: "Schema para a requisição de logout."
  },
  LogoutResponse: {
    title: "LogoutResponse",
    type: "object",
    properties: {
      message: { type: "string" }
    },
    example: {
      message: "Logout realizado com sucesso."
    },
    description: "Schema para a resposta de sucesso do logout."
  },
  RefreshTokenRequest: {
    title: "RefreshTokenRequest",
    type: "object",
    properties: {
      refreshToken: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "Token de atualização do usuário."
      }
    },
    required: ["refreshToken"],
    description: "Schema para a requisição de atualização de tokens."
  },
  RefreshTokenResponse: {
    title: "RefreshTokenResponse",
    type: "object",
    properties: { acessToken: {type: "string"} },
    example: { message: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
    description: "Schema para a resposta de atualização de tokens."
  },
  RevokeTokenRequest: {
    title: "RevokeTokenRequest",
    type: "object",
    properties: {
      userId: {
        type: "string",
        example: "67ffcf9807d44aa7509711e8",
        description: "ID do usuário cujo token será revogado."
      }
    },
    required: ["userId"],
    description: "Schema para a requisição de revogação de token."
  },
  RevokeTokenResponse: {
    title: "RevokeTokenResponse",
    type: "object",
    properties: { userId: {type: "string"} },
    example: { message: "Token revogado com sucesso." },
    description: "Schema para a resposta de sucesso da revogação de token."
  },
  ForgotPasswordRequest: {
    title: "ForgotPasswordRequest",
    type: "object",
    properties: {
      email: {
        type: "string",
        example: "user@example.com",
        description: "E-mail do usuário para recuperação de senha."
      }
    },
    required: ["email"],
    description: "Schema para a requisição de recuperação de senha."
  },
  ResetPasswordRequest: {
    title: "ResetPasswordRequest",
    type: "object",
    properties: {
      email: {
        type: "string",
        example: "user@example.com",
        description: "E-mail do usuário."
      },
      code: {
        type: "string",
        example: "123456",
        description: "Código de recuperação enviado ao e-mail do usuário."
      },
      senha: {
        type: "string",
        example: "NewPassword123!",
        description: "Nova senha do usuário."
      }
    },
    required: ["email", "code", "senha"],
    description: "Schema para a requisição de redefinição de senha."
  }
};

export default authSchemas;