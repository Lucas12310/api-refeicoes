import Curso from "../models/Curso.js";
import mongoose from "mongoose";
class CursoRepository {
  static async listar(filtros, page = 1, limit = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit;

    // Filtros dinâmicos
    const where = {};

    if (filtros.id) {
          where._id = new mongoose.Types.ObjectId(filtros.id);
        }
        
    // Filtro para nome do curso
    if (filtros.nome) {
      where.nome = { $regex: filtros.nome, $options: 'i' };  // Filtro case-insensitive
    }

    // Filtro para código do curso
    if (filtros.codigo_suap) {
      where.codigo_suap = { $regex: filtros.codigo_suap, $options: 'i' };  // Filtro case-insensitive
    }

    if (filtros.contra_turno) {
      const dia = filtros.contra_turno.toLowerCase();  // Converte o dia para minúsculas
      if (['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'].includes(dia)) {
        where[`contra_turnos.${dia}`] = true;  // Filtra pelo dia específico com valor 'true'
      }
    }
    const data = await Curso.find(where)
    .skip(skip)
    .limit(limit)
    .sort({ nome: 1 });  // Ordena pelo nome do curso, em ordem crescente

  // Conta o total de documentos que atendem ao filtro
  const totalCount = await Curso.countDocuments(where);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    totalCount,
    totalPages,
    currentPage: page,
  };
  }

  static async inserir(data) {
      const curso = new Curso(data);
      return await curso.save();
  }

  static async atualizar(id, data) {
    return await Curso.findByIdAndUpdate(id, data, { new: true });
  }
  static async excluir(id) {
    return await Curso.findByIdAndDelete(id);
  }
}

export default CursoRepository;
