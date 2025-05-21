import RotaModel from '../models/Rota.js';

class RotaRepository {
  static async listarRotas(data) {
    const { limite, pagina, nome } = data;
    const filter = {};
    const limit = parseInt(limite) || 10;
    const page = parseInt(pagina) || 1;

    if (nome) filter.nome = { $regex: new RegExp(nome, "i") };

    // Paginação, mais o join com a turma e o curso
    const rotas = await RotaModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)

    // Contagem total para paginação
    const total = await RotaModel.countDocuments(filter);

    const response = { data: rotas, total, limit, totalPages: Math.ceil(total / limit), page };
    return response
  }

  static async listarRotaPorId(id) {
    const route = await RotaModel.findById(id)
    if (!route) {
      throw {
        message: "Rota não encontrada",
        code: 404
      }
    }

    return route;
  }

  static async criar(data) {
    const routeExists = await RotaModel.findOne({ nome: data.nome });

    if (routeExists) throw { code: 409 }

    const newRoute = await RotaModel.create(data);
    return newRoute;
  };
  static async atualizar(data) {
    const { id, ...rest } = data;
    const currentRoute = await RotaModel.findById(id);

    if (!currentRoute) throw { code: 404 };

    const equalData = Object.keys(rest).every((campo) => {
      return currentRoute[campo]?.toString() === rest[campo]?.toString();
    });

    if (equalData) throw { code: 409 };

    const updatedRoute = await RotaModel.findByIdAndUpdate(id, rest, { new: true })

    return updatedRoute;
  }
  static async deletar(id) {
    const deletedRoute = await RotaModel.findByIdAndDelete({ _id: id });
    if (!deletedRoute) throw { code: 404 };
    return;
  }
}

export default RotaRepository;
