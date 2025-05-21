import GrupoRepository from "../repository/GrupoRepository.js";
import GrupoSchema from "../schemas/grupoSchema.js";

class GrupoService {
  static async listarGrupos(queryParams) {
    const ValidatedQuery = GrupoSchema.listar.parse(queryParams);
    const response = await GrupoRepository.listarGrupos(ValidatedQuery);
    if (!response.data || response.data.length === 0) throw { code: 404 }
    return response;
  }
  static async criar(data) {
    const ValidatedData = GrupoSchema.criar.parse(data);
    const newGroup = await GrupoRepository.criar(ValidatedData);
    return newGroup;
  }
  static async atualizar(id, data) {
    const ValidatedIdAndData = GrupoSchema.atualizar.parse({ id, ...data });
    const updatedGroup = await GrupoRepository.atualizar(ValidatedIdAndData);
    return updatedGroup;
  }
  static async deletar(id) {
    const idValidado = GrupoSchema.deletar.parse(id);
    await GrupoRepository.deletar(idValidado);
    return;
  }
}

export default GrupoService;