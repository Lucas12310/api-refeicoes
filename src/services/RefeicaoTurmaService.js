import RefeicaoTurmaRepository from "../repository/RefeicaoTurmaRepository.js";
import TurmaRefeicaoSchema from "../schemas/refeicaoTurmaSchema.js";

class RefeicaoTurmaService {
  static async listarRefeicoesTurma(queryParams) {
    const dataValidada = TurmaRefeicaoSchema.listarRefeicoesTurma.parse(queryParams || {});
    const response = await RefeicaoTurmaRepository.listarRefeicoesTurma(dataValidada);
    return response;
  }

  static async listarRefeicaoTurmaPorId(id) {
    const idValidado = TurmaRefeicaoSchema.buscarRefeicaoPorId.parse(id);
    const refeicao = await RefeicaoTurmaRepository.listarRefeicaoTurmaPorId(idValidado.id);
    return refeicao;
  }

  static async criarRefeicaoTurma(data) {
    const dataValidada = TurmaRefeicaoSchema.criarRefeicaoTurma.parse(data);
    return await RefeicaoTurmaRepository.criarRefeicaoTurma(dataValidada);
  }

  static async atualizarRefeicaoTurma(id, data) {
    const idValidado = TurmaRefeicaoSchema.buscarRefeicaoPorId.parse( id );
    const dataValidado = TurmaRefeicaoSchema.atualizarRefeicaoTurma.parse(data);
    const refeicaoAtualizada = await RefeicaoTurmaRepository.atualizarRefeicaoTurma(idValidado.id, dataValidado);
    return refeicaoAtualizada; 
  }

  static async deletarRefeicaoTurma(id) {
    const idValidado = TurmaRefeicaoSchema.buscarRefeicaoPorId.parse(id);
    const refeicaoDeletada = await RefeicaoTurmaRepository.deletarRefeicaoTurma(idValidado.id);
    return refeicaoDeletada;
  }
}

export default RefeicaoTurmaService;