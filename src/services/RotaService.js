import RotaRepository from "../repository/RotaRepository.js";
import RotaSchema from "../schemas/rotaSchema.js";

class RotaService {
  static async listarRotas(queryParams) {
    const ValidatedQuery = RotaSchema.listar.parse(queryParams);
    const response = await RotaRepository.listarRotas(ValidatedQuery);

    if (!response.data || response.data.length === 0)throw { code: 404 }

    return response;
  }
  static async criar(data) {
    const ValidatedData = RotaSchema.criar.parse(data);
    const newRoute = await RotaRepository.criar(ValidatedData);
    return newRoute;
  }
  static async atualizar(id, data) {
    const ValidatedIdAndData = RotaSchema.atualizar.parse({ id, ...data });
    const updatedRoute = await RotaRepository.atualizar(ValidatedIdAndData);
    return updatedRoute;
  }
  static async deletar(id) {
    const idValidado = RotaSchema.deletar.parse(id);
    await RotaRepository.deletar(idValidado);
    return;
  }
}

export default RotaService;