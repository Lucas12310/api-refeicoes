import { z } from 'zod';

class turmaSchema {
  static contraTurnosSchema = z.object({
        segunda: z.boolean({message:'O valor para segunda-feira deve ser um booleano'}).refine(value => typeof value === 'boolean', {
          message: 'O valor para segunda deve ser um booleano',
        }),
        terca: z.boolean({message:'O valor para terça-feira deve ser um booleano'}).refine(value => typeof value === 'boolean', {
          message: 'O valor para terça deve ser um booleano',
        }),
        quarta: z.boolean({message:'O valor para quarta-feira deve ser um booleano'}).refine(value => typeof value === 'boolean', {
          message: 'O valor para quarta deve ser um booleano',
        }),
        quinta: z.boolean({message:'O valor para quinta-feira deve ser um booleano'}).refine(value => typeof value === 'boolean', {
          message: 'O valor para quinta deve ser um booleano',
        }),
        sexta: z.boolean({message:'O valor para sexta-feira deve ser um booleano'}).refine(value => typeof value === 'boolean', {
          message: 'O valor para sexta deve ser um booleano',
        }),
        sabado: z.boolean({message:'O valor para sabado deve ser um booleano'}).refine(value => typeof value === 'boolean', {
          message: 'O valor para sábado deve ser um booleano',
        }),
        domingo: z.boolean({message:'O valor para domingo deve ser um booleano'}).refine(value => typeof value === 'boolean', {
          message: 'O valor para domingo deve ser um booleano',
        }),
      });
    static objectIdRegex = /^[a-fA-F0-9]{24}$/;
    static objectIdSchema = z.string().refine((value) => this.objectIdRegex.test(value), {
      message: 'ID inválido. O ID deve ter 24 caracteres hexadecimais.',
    });
    static turmaSchema = z.object({
        id: turmaSchema.objectIdSchema,
        codigo_suap: z.string({message:'Codigo suap deve ser string!'}).min(1,"Codigo suap é obrigatório!").max(80, "Codigo suap deve ter no maximo 80 caracteres"),
        descricao: z.string({message:'descricao deve ser string!'}).min(1,"descricao é obrigatório!").max(80, "descricao deve ter no maximo 80 caracteres"),
        curso: turmaSchema.objectIdSchema
    });
    static turmaCreateSchema = turmaSchema.turmaSchema.omit({ id: true });
    static turmaUpdateSchema = turmaSchema.turmaSchema.omit({ id: true }).partial();
    static turmaListSchema = turmaSchema.turmaSchema.partial();
}

export default turmaSchema;
