import { z } from 'zod';

class projetoSchema {
    static turnosSchema = z.object({
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
    static projetoSchema = z.object({
        id: projetoSchema.objectIdSchema,
        nome: z.string({message:'Nome deve ser string'}).min(1,"Nome é obrigatório!").max(80, "Nome do curso deve ter no maximo 80 caracteres"),
        turnos: projetoSchema.turnosSchema,
        status: z.string({message:'status deve ser string'}).min(1,"status é obrigatório!").max(80, "Nome do curso deve ter no maximo 80 caracteres"),
        data_inicio: z.date({message:'Data de inicio deve ser date'}),
        data_termino:z.date({message:'Data de termino deve ser date'}),
        estudantes: z.union([z.string({ message: 'id do(s) estudante(s) deve ser string' }).transform((val) => [val]),z.array(z.string({ message: 'id do(s) estudante(s) deve ser string' }))
    ])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .refine((val) => val.length > 0, {
      message: 'O array deve conter pelo menos 1 estudante.',
    })
    });
    static projetoCreateSchema = projetoSchema.projetoSchema.omit({ id: true });
    static projetoUpdateSchema = projetoSchema.projetoSchema.omit({ id: true }).partial();
    static projetoListSchema = projetoSchema.projetoSchema.partial();
}

export default projetoSchema;
