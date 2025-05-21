import {z} from "zod"

class UsuarioSchema{
  static cadastrarUsuario = z.object({
    nome: z.string().min(1, "Nome é obrigatorio."),
    email: z.string().email("Email invalido"),
    senha: z.string().regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
      "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
    ),
    grupo: z.string().min(1, "Grupo é obrigatorio.").max(24, "Grupo deve conter 24 caracteres."),
    
  })

  static entraUsuario = z.object({
    email: z.string().email("Email invalido"),
    senha: z.string().min(1, "Senha é obrigatoria."),
  })

  static checkUsuario = z.object({
    token: z.string().min(1, "O token não foi informado") ,   
  })

  static listarUsuarios = z.object({
    nome: z.string().regex(/^[a-zA-Z\s]+$/, "O nome deve conter apenas letras e espaços.").optional(),
    email: z.string().email("Email invalido").optional(),
    ativo: z.enum(["true", "false"]).optional(),
    pagina: z.coerce.number().int("A pagina precisa ser um numero inteiro positivo").positive("A pagina precisa ser um numero inteiro positivo").optional().default(1),
  })

  static listarUsuarioPorId = z.object({
    _id: z.string().regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
  })

  static atualizarUsuario = z.object({
    id: z.string({ required_error: "O campo 'id' é obrigatório." })
      .regex(/^[a-fA-F0-9]{24}$/, "O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES)."),
    nome: z.string({ message: "O nome precisa ser definido como uma string/texto." })
      .min(1, "Nome deve conter pelo menos 1 caractere.")
      .optional(),
    email: z.string({ message: "O email precisa ser uma string válida." })
      .email("Email inválido.")
      .optional(),
    senha: z.string({ message: "A senha precisa ser uma string válida." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula e um número."
      )
      .optional(),
    ativo: z.boolean({ message: "O campo 'ativo' deve ser um booleano." })
      .optional(),
  });
}

export default UsuarioSchema