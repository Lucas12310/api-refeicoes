import EstagioModel from "../models/Estagio.js";
import EstudanteModel from "../models/Estudante.js";
import mongoose from "mongoose";
class EstagioRepository {
  static async listarEstagios(query, limit = 10, page = 1) {    
    const { estudante, data_inicio, data_termino, turnos, descricao, status } = query;
    const filter = {};

    if (estudante) {
      filter.estudante = estudante;
    }

    if (data_inicio) {
      const [start, end] = data_inicio.split(",");
      filter.data_inicio = { $gte: new Date(start), $lte: new Date(end) };
    }

    if (data_termino) {
      const [start, end] = data_termino.split(",");
      filter.data_termino = { $gte: new Date(start), $lte: new Date(end) };
    }

    if (turnos) {
      const dias = turnos.split(",");
      dias.forEach((dia) => {
        filter[`turnos.${dia}`] = true;
      });
    }

    if (status) {
      filter.status = status;
    }

    if (descricao) {
      filter.descricao = { $regex: new RegExp(descricao, "i") };
    }

    const estagios = await EstagioModel.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .select("_id descricao data_inicio data_termino turnos status estudante")
      .populate({
        path: "estudante",
        select: "_id nome matricula ativo turma",
        populate: {
          path: "turma",
          select: "_id descricao",
          populate: {
            path: "curso",
            select: "_id nome contra_turnos"
          }
        }
      });

    const total = await EstagioModel.countDocuments(filter);

    const response = {
      data: estagios,
      total,
      limit,
      totalPages: Math.ceil(total / limit),
      page,
    }
    
    return response;
  }

  static async listarEstagioPorId(id) {
    const estagio = await EstagioModel.findById(id)
      .select("_id descricao data_inicio data_termino turnos status estudante")
      .populate({
        path: "estudante",
        select: "_id nome matricula ativo turma",
        populate: {
          path: "turma",
          select: "_id descricao",
          populate: {
            path: "curso",
            select: "_id nome contra_turnos",
          },
        },
      });

    if (!estagio) {
      throw {
        message: "Estágio não encontrado",
        code: 404
      }
    }

    return estagio;
  }

  static async criarEstagio(data) {

    const estudanteExistente = await EstudanteModel.findOne({
      _id: data.estudante,
    });
    if (!estudanteExistente) {
      throw {
        message: "estudante",
        code: 404
      }
    }
    const estagioExistente = await EstagioModel.findOne({
      descricao: data.descricao,
      data_inicio: data.data_inicio,
      data_termino: data.data_termino,
      "estudante": data.estudante,
      "turnos": data.turnos,
    });


    if (estagioExistente) {
      throw {
        code: 409
      }
    }

    const novoEstagio = await EstagioModel.create(data).then((estagio) =>
      estagio.populate({
        path: "estudante",
        select: "_id nome matricula ativo turma",
        populate: {
          path: "turma",
          select: "_id descricao",
          populate: {
            path: "curso",
            select: "_id nome contra_turnos",
          },
        },
      })
    );

    return novoEstagio;
  }

  static async atualizarEstagio(data) {
    const { id, ...novosDados } = data;

    const estagioAtual = await EstagioModel.findById(id);
    if (!estagioAtual) {
      throw {
        message: "id",
        code: 404
      }
    }

    const dadosIguais = Object.keys(novosDados).every((campo) => {
      const valorAtual = estagioAtual[campo];
      const novoValor = novosDados[campo];

      if (typeof valorAtual === "object" && typeof novoValor === "object") {
        return JSON.stringify(valorAtual) === JSON.stringify(novoValor);
      }

      if (valorAtual instanceof Date && typeof novoValor === "string") {
        return valorAtual.toISOString().split("T")[0] === novoValor;
      }

      return valorAtual?.toString() === novoValor?.toString();
    });


    if (dadosIguais) {
      throw {
        message: "data_inicio, data_termino, status, turnos, status e descricao",
        code: 409
      }
    }
    const estagioAtualizado = await EstagioModel.findByIdAndUpdate(id, novosDados, { new: true }).populate({
      path: "estudante",
      select: "_id nome matricula ativo turma",
      populate: {
        path: "turma",
        select: "_id descricao",
        populate: {
          path: "curso",
          select: "_id nome contra_turnos",
        },
      },
    });

    return estagioAtualizado;
  }

  static async deletarEstagio(id) {
    const estagioDeletado = await EstagioModel.findByIdAndDelete(id).select("_id descricao");
    if (!estagioDeletado) {
      throw {
        message: "estagio",
        code: 404
      }
    }

    return estagioDeletado;
  }

  static async buscarEstagioEstudante(id){
    id.status = "Em andamento"
    //console.log(id)
    const estagio = await EstagioModel.find(id);
    return estagio
  }
}
export default EstagioRepository;