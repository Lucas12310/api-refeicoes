import { z } from "zod";

class EstagiosSchema {
  static listarEstagios = z.object({
    pagina: z.coerce.number().int().positive().default(1),
    estudante: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).").optional(),
    data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2})?$/, {
      message: "O formato deve ser 'YYYY-MM-DD,YYYY-MM-DD'.",
    }).optional(),
    data_termino: z.string().regex(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2})?$/, {
      message: "O formato deve ser 'YYYY-MM-DD,YYYY-MM-DD'.",
    }).optional(),
    turnos: z
    .string()
    .refine((val) => !/^\d+$/.test(val), {
      message: "O turno precisa ser um dia da semana",
    }).optional(),
    status: z.enum(["Em andamento", "Encerrado", "Pausado"], {message:"Deverá ser os seguintes campos: Em andamento, Encerrado, Pausado."}).optional(),
    descricao: z.string().optional(),
  });

  static buscarEstagioPorId = z.object({
    id: z
    .string({ required_error: "O campo 'id' é obrigatório." })
    .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });

  static criarEstagio = z.object({
    estudante: z.string().nonempty("O ID do estudante é obrigatório."),
    data_inicio: z.string().nonempty("A data de início é obrigatória."),
    data_termino: z.string().nonempty("A data de término é obrigatória."),
    status: z.enum(["Em andamento", "Encerrado", "Pausado"]),
    turnos: z.object({
      segunda: z.boolean(),
      terca: z.boolean(),
      quarta: z.boolean(),
      quinta: z.boolean(),
      sexta: z.boolean(),
      sabado: z.boolean(),
      domingo: z.boolean(),
    }),
    descricao: z.string().nonempty("A descrição é obrigatória."),
  });

  static atualizarEstagio = z.object({
    id: z
    .string({ required_error: "O campo 'id' é obrigatório." })
    .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    estudante: z.string().optional(),
    data_inicio: z.string().optional(),
    data_termino: z.string().optional(),
    descricao: z.string().optional(),
    status: z.enum(["Em andamento", "Encerrado", "Pausado"]).optional(),
    turnos: z.object({
      segunda: z.boolean().optional(),
      terca: z.boolean().optional(),
      quarta: z.boolean().optional(),
      quinta: z.boolean().optional(),
      sexta: z.boolean().optional(),
      sabado: z.boolean().optional(),
      domingo: z.boolean().optional(),
    }).optional(),
  });
  static deletarEstagio = z.object({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });
}

export default EstagiosSchema;
