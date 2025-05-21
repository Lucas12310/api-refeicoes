import TurmaRepository from "../repository/TurmaRepository.js";
import turmaSchema from "../schemas/turmaSchema.js";


class TurmaService {
    static async listar(filtro, page = 1, limit = 10) {
        const validatedFilter = turmaSchema.turmaListSchema.parse(filtro);
        const response = await TurmaRepository.listar(validatedFilter, page, limit);
        return response;
    }

    static async inserir(data) {
        const validatedData = turmaSchema.turmaCreateSchema.parse(data);
        const codigo = {codigo_suap:data.codigo_suap}
        const validatedCod = await TurmaRepository.listar(codigo);
        if(validatedCod.totalCount >= 1){
          throw {
            message:"Codigo de turma ja existente!",
            code:400
          }
        }
        const response = await TurmaRepository.inserir(validatedData);
        return response;
    }

    static async atualizar(id, data) {
        const validatedId = turmaSchema.objectIdSchema.parse(id)
        const validatedData = turmaSchema.turmaUpdateSchema.parse(data);
        if(data.codigo_suap){
        const codigo = {codigo_suap:data.codigo_suap}
        const validatedCod = await TurmaRepository.listar(codigo);
        if(validatedCod.totalCount >= 1){
          throw {
            message:"Codigo de turma ja existente!",
            code:400
          }
        }
      }
        const response = await TurmaRepository.atualizar(validatedId, validatedData);
        return response;
    }

    static async excluir(id) {
        const validatedId = turmaSchema.objectIdSchema.parse(id)
        const response = await TurmaRepository.excluir(validatedId);
        return response;
    }
}

export default TurmaService;