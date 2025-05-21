import { z } from "zod"

class AuthSchema {
  static login = z.object({
    email: z.string().email("Email invalido").min(1, "Email é obrigatório."),
    senha: z.string(),
  });
  static logout = z.object({
    userId: z
      .string({ required_error: "O campo 'id' é obrigatório." })
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });
  static refreshTokens = z.object({
    refreshToken: z.string({ required_error: "O campo 'refreshToken' é obrigatório." }),
  });
  static reset = z.object({
    email: z.string().email(),
    code: z.string().min(6).max(6),
    senha: z.string().min(6),
  });
  static recovery = z.object({
    email: z.string().email(),
  });
}

export default AuthSchema