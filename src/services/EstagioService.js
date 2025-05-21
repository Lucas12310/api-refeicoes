import EstagioRepository from "../repository/EstagioRepository.js";
import EstagiosSchema from "../schemas/estagiosSchema.js";

class EstagioService {
  static async listarEstagios(queryParams = {}) {
    const query = EstagiosSchema.listarEstagios.parse(queryParams);
    const { pagina = 1, limite = 10 } = queryParams;

    const response = await EstagioRepository.listarEstagios(query, limite, pagina);

    if (!response.data || response.data.length === 0) {
      throw{
        code: 404,
        message: "Nenhum estágio encontrado.",
      }
    }

    return response;
  }
  static async listarEstagioPorId(params) {
    const { id } = EstagiosSchema.buscarEstagioPorId.parse(params);
    const estagio = await EstagioRepository.listarEstagioPorId(id);

    if (!estagio) {
      throw new Error("Estágio não encontrado.");
    }

    return estagio;
  }

  static async criarEstagio(data) {
    const estagio = EstagiosSchema.criarEstagio.parse(data);
    const novoEstagio = await EstagioRepository.criarEstagio({ ...estagio });
    return novoEstagio;
  }

  static async atualizarEstagio(id, data) {
    const estagio = EstagiosSchema.atualizarEstagio.parse( { ...id, ...data } );
    // console.log("Estagio",estagio);
    
    const estagioAtualizado = await EstagioRepository.atualizarEstagio(estagio);

    return estagioAtualizado;
  }

  static async deletarEstagio(id) {
    const idValidado = EstagiosSchema.deletarEstagio.parse({ id });
    const estagioDeletado = await EstagioRepository.deletarEstagio(idValidado.id);
    
    return estagioDeletado;
  }
}

export default EstagioService;