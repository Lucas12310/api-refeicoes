import Projeto from "../models/Projeto.js";
import Estudante from "../models/Estudante.js";
import mongoose from "mongoose";
class ProjetoRepository {
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
    if (filtros.codigo) {
      where.codigo = { $regex: filtros.codigo, $options: 'i' };  // Filtro case-insensitive
    }
    if (filtros.status){
      where.status = { $regex: filtros.status, $options: 'i' };  // Filtro case-insensitive
    }
    if (filtros.contra_turno) {
      const dia = filtros.contra_turno.toLowerCase();  // Converte o dia para minúsculas
      if (['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'].includes(dia)) {
        where[`contra_turnos.${dia}`] = true;  // Filtra pelo dia específico com valor 'true'
      }
    }
    if(filtros.estudantes){
      where.estudantes = {
        $in: filtros.estudantes.map((id) => new mongoose.Types.ObjectId(id))
      };
    }

    const data = await Projeto.find(where)
    .skip(skip)
    .limit(limit)
    .sort({ nome: 1 });  // Ordena pelo nome do curso, em ordem crescente

  // Conta o total de documentos que atendem ao filtro
  const totalCount = await Projeto.countDocuments(where);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    totalCount,
    totalPages,
    currentPage: page,
  };
  }
  static async listarID(id) {
    return await Projeto.findById(id)
}
  static async inserir(data) {
      const projeto = new Projeto(data);
      return await projeto.save();
  }

  static async atualizar(id, data) {
    return await Projeto.findByIdAndUpdate(id, data, { new: true });
  }
  static async excluir(id) {
    return await Projeto.findByIdAndDelete(id);
  }
  static async buscarEstudante(matricula){
    return await Estudante.find(matricula)
  }
}

export default ProjetoRepository;
