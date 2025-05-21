import PermissoesRepository from "../repository/PermissoesRepository.js";
import PermissoesSchema from "../schemas/permissoesSchemas.js";
class PermissoesService {
  static async listarPermissoes(queryParams) {
    const ValidatedQuery = PermissoesSchema.listar.parse(queryParams);
    const response = await PermissoesRepository.listarPermissoes(ValidatedQuery);
    if (!response.data || response.data.length === 0) throw { code: 404 }
    return response;
  };
  static async criar(data) {
    const ValidateData = PermissoesSchema.criar.parse(data);
    const newPermission = await PermissoesRepository.criar(ValidateData);
    return newPermission;
  }

  static async atualizar(id, data) {
    const ValidatedIdAndData = PermissoesSchema.atualizar.parse({ id, ...data });
    const updatedPermission = await PermissoesRepository.atualizar(ValidatedIdAndData);
    return updatedPermission;
  }

  static async deletar(id) {
    const idValidado = PermissoesSchema.deletar.parse(id);
    
    await PermissoesRepository.deletar(idValidado);
    return;
  }
}

export default PermissoesService;