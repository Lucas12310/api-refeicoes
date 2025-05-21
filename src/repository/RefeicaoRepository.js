import Refeicao from "../models/Refeicao.js";

class RefeicaoRepository {
  
  static async create(refeicao) {
    return await Refeicao.create(refeicao);
  }

  static async findById(id) {
    return await Refeicao.findById(id);
  }

  static async findAll() {
    return await Refeicao.find();
  }

  static async find(objJaAlmocou) {
    const { estudante, data} = objJaAlmocou;
    const filter = {};

    if (estudante) {
      filter["estudante._id"] = estudante;
    }

    if (data) {
      const [start, end] = data.split(",");
      filter.data = { $gte: new Date(start), $lte: new Date(end) };
    }
    
    const refeicoes = await Refeicao.find(filter)
    
    const response = { data: refeicoes };

    return response
  }

  static async relatorio(dataInicio, dataTermino, filtros = {}) {
    const query = {
      data: {
        $gte: dataInicio,
        $lte: dataTermino,
      },
    };
    
    // Aplica os filtros recebidos
    if (filtros.curso) {
      query["estudante.curso"] = filtros.curso;
    }

    if (filtros.matricula) {
      query["estudante.matricula"] = filtros.matricula;
    }
    if (filtros.nome) {
      query["estudante.nome"] = filtros.nome;
    }

    if (filtros.turma) {
      query["estudante.turma"] = filtros.turma;
    }

    if (filtros.tipoRefeicao) {
      query["tipoRefeicao"] = filtros.tipoRefeicao;
    }
    
    return await Refeicao.find(query)
  }
}

export default RefeicaoRepository;
