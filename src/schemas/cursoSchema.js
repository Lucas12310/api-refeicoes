import { z } from 'zod';

class cursoSchema {
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
    static cursoSchema = z.object({
        id: cursoSchema.objectIdSchema,
        nome: z.string({message:'Nome deve ser string'}).min(1,"Nome é obrigatório!").max(80, "Nome do curso deve ter no maximo 80 caracteres"),
        contra_turnos: cursoSchema.contraTurnosSchema,
        codigo_suap: z.string({message:'codigo deve ser string'}).min(1,"Codigo é obrigatório!").max(10, "Codigo do curso deve ter no maximo 10 caracteres"),
    });
    static cursoCreateSchema = cursoSchema.cursoSchema.omit({ id: true });
    static cursoUpdateAndListSchema = cursoSchema.cursoSchema.omit({ id: true }).partial();
    static cursoListSchema = cursoSchema.cursoSchema.partial();
}

export default cursoSchema;
