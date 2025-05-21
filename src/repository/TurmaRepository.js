import Turma from "../models/Turma.js";
import mongoose from "mongoose";

class TurmaRepository {
  static async listar(filtros, page = 1, limit = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit;
    // Filtros dinâmicos
    const where = {};
    if (filtros.id) {
      where._id = new mongoose.Types.ObjectId(filtros.id);
    }

    if (filtros.codigo_suap) {
      where.codigo_suap = { $regex: filtros.codigo_suap, $options: "i" }; // Filtro case-insensitive
    }

    if (filtros.descricao) {
      where.descricao = { $regex: filtros.descricao, $options: "i" }; // Filtro case-insensitive
    }
    
    if (filtros.curso) {
      where['curso'] = new mongoose.Types.ObjectId(filtros.curso);
    }
    
    const data = await Turma.find(where)
      .skip(skip)
      .limit(limit)
      .sort({ descricao: 1 }) // Ordena pelo nome da turma, em ordem crescente
      .populate('curso');

    // Conta o total de documentos que atendem ao filtro
    const totalCount = await Turma.countDocuments(where);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }
  static async inserir(data) {
    const turma = new Turma(data);
    return await turma.save();
  }

  static async atualizar(id, data) {
    return await Turma.findByIdAndUpdate(id, data, { new: true });
  }
  static async excluir(id) {
    return await Turma.findByIdAndDelete(id);
  }
  /*
  static async create(turmaData) {
    const turmaCriada = await Turma.create(turmaData)
      .then((turma) => turma.populate("curso"))
      .then((turma) => turma); // Retornar a turma populada
    return turmaCriada;
  }
  */
}

export default TurmaRepository;
