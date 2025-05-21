import { z } from "zod";

class EstudanteSchema {
  static listarEstudantes = z.object({
    nome: z.string({
      message: "O nome precisa ser definido como uma string/texto."
    }).refine((val) => !/^\d+$/.test(val), {
      message: "O nome precisa ser em palavras e não números.",
    }).optional(),
    matricula: z.string().min(13, "Matrícula deve ter no mínimo 13 caracteres").max(18, "Matrícula deve ter no máximo 18 caracteres").optional(),
    turma: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'turma' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).").optional(),
    curso: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'curso' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).").optional(),
    ativo: z.string().refine((val) => val === "true" || val === "false", {
      message: "O campo 'ativo' deve ser 'true' ou 'false'.",
    }).optional(),
    pagina: z.coerce.number({
      message: "A pagina precisa ser um número inteiro positivo."
    }).int({
      message: "A pagina precisa ser um número inteiro positivo."
    }).positive({
      message: "A pagina precisa ser um número inteiro positivo."
    }).optional().default(1),
    pagina: z
      .coerce.number("O campo 'pagina' deve ser um número inteiro.")
      .int("O campo 'pagina' deve ser um número inteiro.")
      .positive("O campo 'pagina' deve ser no mínimo 1.")
      .default(1),
    limite: z
      .coerce.number()
      .int("O campo 'limite' deve ser um número inteiro.")
      .positive("O campo 'limite' deve ser no mínimo 1.")
      .default(10),
  });

  static buscarEstudantePorId = z.object({
    id: z
      .string({ required_error: "O campo 'id' é obrigatório." })
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });

  static criarEstudante = z.object({
    nome: z.string({
      message: "O nome precisa ser definido como uma string/texto."
    }).min(1, "Nome é obrigatório e deve conter pelo menos 1 caractere.").refine((val) => !/^\d+$/.test(val), {
      message: "O nome precisa ser em palavras e não números.",
    }),
    matricula: z.string({
      message: "A matrícula precisa ser uma string/texto."
    }).min(1, "Matrícula é obrigatória e deve conter pelo menos 1 caractere."),
    turma: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'turma' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    curso: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'curso' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    ativo: z.boolean().default(true),
  });

  static atualizarEstudante = z.object({
    id: z.string({ required_error: "O campo 'id' é obrigatório." })
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    nome: z.string({
      message: "O nome precisa ser definido como uma string/texto."
    }).min(1, "Nome deve conter pelo menos 1 caractere.").optional(),
    matricula: z.string({
      message: "A matrícula precisa ser uma string/texto."
    }).min(1, "Matrícula deve conter pelo menos 1 caractere.").optional(),
    turma: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'turma' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).").optional(),
    curso: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'curso' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).").optional(),
    ativo: z.boolean().optional(),
  });

  static deletarEstudante = z.string({
    id: z.string({
      message: "O ID precisa ser definido como uma string/texto. (Neste caso seria um ObjectId no mongoDB)"
    }).regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });

  static inativarEstudantes = z.object({
    confirmacao: z.boolean({
      message: "Confirmação deve ser um valor booleano.",
    }).refine((val) => val === true, {
      message: "Confirmação deve ser verdadeira para inativar estudantes.",
    }),
  });
}

export default EstudanteSchema;
