import { z } from "zod";

class GrupoSchema {
  static listar = z.object({
    pagina: z.coerce.number({
      message: "A página precisa ser definida como um número."
    }).int({
      message: "A página precisa ser definida como um número inteiro."
    }).positive({
      message: "A página precisa ser definida como um número inteiro positivo."
    }).default(1),
    nome: z.string({
      message: "O nome precisa ser definido como uma string/texto."
    }).refine((val) => !/^\d+$/.test(val), {
      message: "O nome precisa ser em palavras e não em números.",
    }).optional(),
  });

  static criar = z.object({
    nome: z.string().min(1, "Nome é obrigatório e deve conter pelo menos 1 caractere.").refine((val) => !/^\d+$/.test(val), {
      message: "O nome precisa ser em palavras e não números.",
    }),
  });

  static atualizar = z.object({
    id: z
      .string({ required_error: "O campo 'id' é obrigatório." })
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    nome: z.string().refine((val) => !/^\d+$/.test(val), {
      message: "O nome precisa ser em palavras e não números.",
    }).optional(),
  });
  static deletar = z.string({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });
}

export default GrupoSchema;
