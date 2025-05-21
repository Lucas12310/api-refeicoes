import EstudanteRepository from "../repository/EstudanteRepository.js";
import EstudanteSchema from "../schemas/estudantesSchema.js";

class EstudanteService {
  static async listarEstudantes(queryParams) {
    const dataValidada = EstudanteSchema.listarEstudantes.parse(queryParams || {});
    // console.log('[EstudanteService] filtro validado:', dataValidada); Serviu apenas para debug dos testes
    const response = await EstudanteRepository.listarEstudantes(dataValidada);
    if (!response.data || response.data.length === 0) {
      throw {
        code: 404
      }
    }
    return response;
  }

  static async listarEstudantePorId(id) {
    const params = EstudanteSchema.buscarEstudantePorId.parse(id);
    const response = await EstudanteRepository.listarEstudantesPorId(params);
  
    if (!response) {
      throw {
        message: "Estudante não encontrado",
        code: 404
      }
    }
    return response;
  }

  static async criarEstudante(data) {
    const estudante = EstudanteSchema.criarEstudante.parse(data);
    const novoEstudante = await EstudanteRepository.criarEstudante(estudante);
    return novoEstudante;
  }

  static async AtualizarEstudante(id, data) {
    const estudante = EstudanteSchema.atualizarEstudante.parse({
      id,
      ...data,
    });
    
    const estudanteAtualizado = await EstudanteRepository.atualizarEstudante(estudante);
    return estudanteAtualizado;
  }

  static async DeletarEstudante(id) {
    const idValidado = EstudanteSchema.deletarEstudante.parse(id);
    const estudanteDeletado = await EstudanteRepository.DeletarEstudante(idValidado);

    if (!estudanteDeletado) {
      throw { code: 404};
    }
    
    return estudanteDeletado;
  }

  static async InativarEstudantes(data) {
    const dataValidada = EstudanteSchema.inativarEstudantes.parse(data);
    const estudanteDeletado = await EstudanteRepository.inativarEstudantes(dataValidada);
    return estudanteDeletado;
  }
}

export default EstudanteService;
