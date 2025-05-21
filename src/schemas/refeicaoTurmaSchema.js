import { z } from "zod";

class RefeicaoTurmaSchema {
  static criarRefeicaoTurma = z.object({
    turma: z
      .string({ required_error: "O campo 'turma' é obrigatório." })
      .min(1, "O campo 'turma' não pode estar vazio.")
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'turma' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    data_liberado: z
      .string({ required_error: "O campo 'data_liberado' é obrigatório." })
      .refine(
        (data) => !isNaN(Date.parse(data)),
        "O campo 'data_liberado' deve ser uma data válida no formato ISO (####-##-##)."
      ),
    descricao: z
      .string({ required_error: "O campo 'descricao' é obrigatório." })
      .min(3, "O campo 'descricao' deve ter pelo menos 3 caracteres.")
      .max(100, "O campo 'descricao' deve ter no máximo 100 caracteres.")
      .optional(),
  });

  static listarRefeicoesTurma = z.object({
    turma: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'turma' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).")
      .optional(),
    data_liberado: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2})?$/, {
        message: "O formato deve ser 'YYYY-MM-DD,YYYY-MM-DD'.",
      })
      .optional(),
    descricao: z
      .string()
      .min(3, "O campo 'descricao' deve ter pelo menos 3 caracteres.")
      .max(100, "O campo 'descricao' deve ter no máximo 100 caracteres.")
      .optional(),
    pagina: z
      .coerce.number()
      .int("O campo 'pagina' deve ser um número inteiro.")
      .positive("O campo 'pagina' deve ser no mínimo 1.")
      .default(1),
    limite: z
      .coerce.number()
      .int("O campo 'limite' deve ser um número inteiro.")
      .positive("O campo 'limite' deve ser no mínimo 1.")
      .default(10),
  });

  static buscarRefeicaoPorId = z.object({
    id: z
      .string({ required_error: "O campo 'id' é obrigatório." })
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });

  static atualizarRefeicaoTurma = z.object({
    turma: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'turma' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).")
      .optional(),
    data_liberado: z
      .string()
      .refine(
        (data) => !isNaN(Date.parse(data)),
        "O campo 'data_liberado' deve ser uma data válida no formato ISO."
      )
      .optional(),
    descricao: z
      .string()
      .min(3, "O campo 'descricao' deve ter pelo menos 3 caracteres.")
      .max(100, "O campo 'descricao' deve ter no máximo 100 caracteres.")
      .optional(),
  });
}

export default RefeicaoTurmaSchema;