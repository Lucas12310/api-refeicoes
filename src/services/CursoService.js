import CursoRepository from '../repository/CursoRepository.js';
import cursoSchema from "../schemas/cursoSchema.js"


class CursoService {
    static async listar(filtro, page = 1, limit = 10) {
        const validatedFilter = cursoSchema.cursoListSchema.parse(filtro);
        const response = await CursoRepository.listar(validatedFilter, page, limit);
        return response;
    }

    static async inserir(data) {
        const validatedData = cursoSchema.cursoCreateSchema.parse(data);
        const codigo_suap = {codigo_suap:data.codigo_suap}
        const validatedCod = await CursoRepository.listar(codigo_suap);
        if(validatedCod.totalCount >= 1){
          throw {
            message:"Codigo de curso ja existente!",
            code:400
          }
        }
        const response = await CursoRepository.inserir(validatedData);
        return response;
    }

    static async atualizar(id, data) {
        const validatedId = cursoSchema.objectIdSchema.parse(id)
        const validatedData = cursoSchema.cursoUpdateAndListSchema.parse(data);
        if(data.codigo_suap){
          const codigo_suap = {codigo_suap:data.codigo_suap}
          const validatedCod = await CursoRepository.listar(codigo_suap);
          if(validatedCod.totalCount >= 1){
            throw {
              message:"Codigo de curso ja existente!",
              code:400
            }
          }
        }
        const response = await CursoRepository.atualizar(validatedId, validatedData);
        return response;
    }

    static async excluir(id) {
        const validatedId = cursoSchema.objectIdSchema.parse(id)
        const response = await CursoRepository.excluir(validatedId);
        return response;
    }
}

export default CursoService;