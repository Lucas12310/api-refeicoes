import RefeicaoTurma from "../models/RefeicaoTurma.js";
import TurmaModel from "../models/Turma.js";
import TurmaRefeicaoModel from "../models/RefeicaoTurma.js";

class RefeicaoTurmaRepository {
  static async listarRefeicoesTurma(query) {
    const { turma, data_liberado, descricao, limite, pagina } = query;
    const filter = {};
    const limit = parseInt(limite) || 10;
    const page = parseInt(pagina) || 1;
    if (turma) {
      filter.turma = turma;
    }

    if (data_liberado) {
      const [start, end] = data_liberado.split(",");
      filter.data_liberado = { $gte: new Date(start), $lte: new Date(end) };
    }

    if (descricao) {
      filter.descricao = { $regex: new RegExp(descricao, "i") };
    }

    const refeicoes = await RefeicaoTurma.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: "turma", select: "_id descricao",
        populate: {
          path: "curso",
          select: "_id nome contra_turnos",
        }
      });

    const total = await RefeicaoTurma.countDocuments(filter);
    const response = { data: refeicoes, total, limit, totalPages: Math.ceil(total / limit), page };

    if (!response.data || response.data.length === 0) {
      throw {
        code: 404
      }
    }

    return response
  }

  static async listarRefeicaoTurmaPorId(id) {
    const refeicao = await RefeicaoTurma.findById(id).populate({
      path: "turma", select: "_id descricao",
      populate: {
        path: "curso",
        select: "_id nome contra_turnos",
      }
    });

    if (!refeicao) {
      throw {
        message: "Id inexistente",
        code: 404
      }
    }

    return refeicao;
  }

  static async criarRefeicaoTurma(data) {
    const turmaBanco = await TurmaModel.findById(data.turma);
    if (!turmaBanco) {
      throw {
        code: 404
      }
    }
    const TurmaRefeicaoExistente = await TurmaRefeicaoModel.findOne({
      turma: data.turma,
      data_liberado: data.data_liberado,
      descricao: data.descricao,
    });

    if (TurmaRefeicaoExistente) {
      throw {
        code: 409
      }
    }

    const novaRefeicao = await RefeicaoTurma.create(data);
    return novaRefeicao.populate({
      path: "turma", select: "_id descricao",
      populate: {
        path: "curso",
        select: "_id nome contra_turnos",
      }
    });
  }

  static async atualizarRefeicaoTurma(id, novosDados) {
    const TurmaRefeicaoAtual = await TurmaRefeicaoModel.findById(id);

    if (novosDados.turma) {
      const turma = await TurmaModel.findById(novosDados.turma);
      if (!turma) {
        throw {
          message: "turma",
          code: 404
        }
      }
    }

    if (!TurmaRefeicaoAtual) {
      throw {
        code: 404,
      };
    }

    const refeicaoAtualizada = await RefeicaoTurma.findByIdAndUpdate(id, novosDados, { new: true }).populate("turma", "_id descricao");
    return refeicaoAtualizada;
  }

  static async deletarRefeicaoTurma(id) {
    const TurmaRefeicaoAtual = await TurmaRefeicaoModel.findById(id);

    if (!TurmaRefeicaoAtual) {
      throw {
        message: "id",
        code: 404
      }
    }

    const refeicaoDeletada = await RefeicaoTurma.findByIdAndDelete(id).select("_id descricao");
    return refeicaoDeletada;
  }

  static async listarRefeicaoAtipica(data){
    const { turma, data_liberado} = data;
    const filter = {};

    if (turma) {
      filter.turma = turma;
    }

    if (data_liberado) {
      const [start, end] = data_liberado.split(",");
      filter.data_liberado = { $gte: new Date(start), $lte: new Date(end) };
    }

    const refeicoes = await RefeicaoTurma.find(filter)
      .populate({
        path: "turma", select: "_id descricao",
        populate: {
          path: "curso",
          select: "_id nome contra_turnos",
        }
      });


    const response = { data: refeicoes };

    return response
  }
}

export default RefeicaoTurmaRepository;