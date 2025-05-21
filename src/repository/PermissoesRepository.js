import PermissoesModel from '../models/Permissoes.js';
import GrupoRepository from './GrupoRepository.js';
import RotaRepository from './RotaRepository.js';

class PermissoesRepository {
  static async listarPermissoes(data) {
    const { limite, pagina, grupo, rota } = data;
    const filter = {};
    const limit = parseInt(limite) || 10;
    const page = parseInt(pagina) || 1;

    if (grupo) {
      const grupos = await GrupoRepository.listarGrupos({ nome: grupo });
      const grupoIds = grupos.data.map((r) => r._id); // Obter os IDs dos grupos encontrados
      if (grupoIds.length > 0) {
        filter.grupo_id = { $in: grupoIds };
      } else {
        return { data: [], total: 0, limit, totalPages: 0, page };
      }
    }

    if (rota) {
      const rotas = await RotaRepository.listarRotas({ nome: rota });
      const rotaIds = rotas.data.map((r) => r._id);
      if (rotaIds.length > 0) {
        filter.rota_id = { $in: rotaIds };
      } else {
        return { data: [], total: 0, limit, totalPages: 0, page };
      }
    }

    const permissoes = await PermissoesModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id metodos')
      .populate({
        path: 'grupo_id',
        select: '_id nome',
      })
      .populate({
        path: 'rota_id',
        select: 'nome rota',
      });

    // Contagem total para paginação
    const total = await PermissoesModel.countDocuments(filter);

    const response = { data: permissoes, total, limit, totalPages: Math.ceil(total / limit), page };
    return response
  };
  static async criar(data) {
    const { grupo_id, rota_id } = data;
    const grupo = await GrupoRepository.listarGrupoPorId(grupo_id);
    if (!grupo) throw { code: 404 };
    const rota = await RotaRepository.listarRotaPorId(rota_id);
    if (!rota) throw { code: 404 };
    
    const newPermission = await PermissoesModel.create(data);
    return newPermission;
  }

  static async atualizar(data) {
    const { id, ...rest } = data;
    const currentPermission = await PermissoesModel.findById(id);

    if (!currentPermission) throw { code: 404 };

    const updatedPermission = await PermissoesModel.findByIdAndUpdate(id, rest, { new: true });
    return updatedPermission;
  }

  static async deletar(id) {
    const deletedPermission = await PermissoesModel.findByIdAndDelete(id);
    if (!deletedPermission) throw { code: 404 };
    return;
  }
}

export default PermissoesRepository;
