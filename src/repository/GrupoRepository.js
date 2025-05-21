import GrupoModel from '../models/Grupo.js';

class GrupoRepository {
  static async listarGrupos(data) {
    const { limite, pagina, nome } = data;
    const filter = {};
    const limit = parseInt(limite) || 10;
    const page = parseInt(pagina) || 1;

    if (nome) filter.nome = { $regex: new RegExp(nome, "i") };

    const grupos = await GrupoModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id nome')

    // Contagem total para paginação
    const total = await GrupoModel.countDocuments(filter);

    const response = { data: grupos, total, limit, totalPages: Math.ceil(total / limit), page };
    return response
  };

  static async listarGrupoPorId(id) {
    const group = await GrupoModel.findById(id)
    if (!group) {
      throw {
        message: "Grupo não encontrado",
        code: 404
      }
    }

    return group;
  }

  static async criar(data) {
    const groupExists = await GrupoModel.findOne({ nome: data.nome });

    if (groupExists) throw { code: 409 }

    const newGroup = await GrupoModel.create(data);
    return newGroup;
  };
  static async atualizar(data) {
    const { id, ...rest } = data;
    const currentGroup = await GrupoModel.findById(id);

    if (!currentGroup) throw { code: 404 };

    const equalData = Object.keys(rest).every((campo) => {
      return currentGroup[campo]?.toString() === rest[campo]?.toString();
    });

    if (equalData) throw { code: 409 };

    const updatedGroup = await GrupoModel.findByIdAndUpdate(id, rest, { new: true })

    return updatedGroup;
  }
  static async deletar(id) {
    const groupDeleted = await GrupoModel.findByIdAndDelete({ _id: id });
    if (!groupDeleted) throw { code: 404 };
    return;
  }
}

export default GrupoRepository;
