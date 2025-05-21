import { z } from "zod";

class RefeicaoSchema {
  static registrar = z.string({
    matricula: z.string().min(1, "A matrícula é obrigatória."),
  });

  static relatorio = z.object({
    dataInicio: z.string().min(1, {message: "Data de início é obrigatória."}).refine(
      (data) => !isNaN(Date.parse(data)),
      "O campo 'data_liberado' deve ser uma data válida no formato ISO."
    ),
    dataTermino: z.string().min(1, "Data de término é obrigatória.").refine(
      (data) => !isNaN(Date.parse(data)),
      "O campo 'data_liberado' deve ser uma data válida no formato ISO."
    ),
    matricula: z.string().optional(),
    nome: z.string().optional(),
    curso: z.string().optional(),
    turma: z.string().optional(),
    tipoRefeicao: z.string().optional(),
  });
}

export default RefeicaoSchema;