import { z } from "zod";

class PermissoesSchema {
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
    grupo: z.string({
      message: "O grupo precisa ser definido como uma string/texto."
    }).refine((val) => !/^\d+$/.test(val), {
      message: "O grupo precisa ser em palavras e não em números.",
    }).optional(),
    rota: z.string({
      message: "O rota precisa ser definido como uma string/texto."
    }).refine((val) => !/^\d+$/.test(val), {
      message: "O rota precisa ser em palavras e não em números.",
    }).optional(),
  });

  static criar = z.object({
    metodos: z.array(z.string({
      message: "Cada método precisa ser definido como uma string/texto."
    }).refine((val) => !/^\d+$/.test(val), {
      message: "Cada método precisa ser em palavras e não em números.",
    })).nonempty({
      message: "O array de métodos não pode estar vazio."
    }),
    grupo_id: z.string({ message: "O campo 'grupo_id' é obrigatório." })
    .regex(/^[a-fA-F0-9]{24}$/, "O campo 'grupo_id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    rota_id: z.string({ message: "O campo 'rota_id' é obrigatório." })
    .regex(/^[a-fA-F0-9]{24}$/, "O campo 'rota_id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });

  static atualizar = z.object({
    id: z.string({ message: "O campo 'id' é obrigatório." })
    .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    metodos: z.array(z.string({
      message: "Cada método precisa ser definido como uma string/texto.",
    }).refine((val) => !/^\d+$/.test(val), {
      message: "Cada método precisa ser em palavras e não em números.",
    })).optional(),
    grupo_id: z.string({ message: "O campo 'grupo_id' é obrigatório." })
    .regex(/^[a-fA-F0-9]{24}$/, "O campo 'grupo_id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).").optional(),
    rota_id: z.string({ message: "O campo 'rota_id' é obrigatório." })
    .regex(/^[a-fA-F0-9]{24}$/, "O campo 'rota_id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).").optional(),
  });

  static deletar = z.string({
    id: z.string({ message: "O campo 'id' é obrigatório." }).regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  });
}

export default PermissoesSchema;
