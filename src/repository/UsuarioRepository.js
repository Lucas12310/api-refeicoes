import Usuario from "../models/Usuario.js";

class UsuarioRepository {
  constructor({ model = UsuarioModel } = {}) {
    this.model = model;
  }

  static async create(data) {
    return await Usuario.create(data);
  }

  static async findByEmail(email) {
    return await Usuario.findOne({ email });
  }

  static async findById(id) {
    return await Usuario.findById(id);
  }

  static async update(id, data) {
    return await Usuario.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id) {
    console.log("vava", id);//Que vava mano

    return await Usuario.findByIdAndDelete(id);
  }

  static async listarUsuarios(data) {
    const { nome, email, ativo, ordenar, limite, pagina } = data;

    const filter = {};
    const limit = parseInt(limite) || 10;
    const page = parseInt(pagina) || 1;

    // Filtro por nome (usando regex para busca parcial e case-insensitive)
    if (nome) {
      filter.nome = { $regex: nome, $options: "i" }; // "i" torna a busca case-insensitive
    }

    // Filtro por email
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    // Filtro por status ativo
    if (ativo !== undefined) {
      if (ativo === "true") {
        filter.ativo = true;
      } else if (ativo === "false") {
        filter.ativo = false;
      }
    }

    // Ordenação
    const sort = {};
    if (ordenar) {
      const [campo, direcao] = ordenar.split("-");
      sort[campo] = direcao === "desc" ? -1 : 1;
    }

    // Paginação
    const skip = (page - 1) * limit;

    // Consulta ao banco de dados
    const usuarios = await Usuario.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("_id nome email ativo grupo");

    const total = await Usuario.countDocuments(filter);

    return {
      data: usuarios,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  static async updateUserPassword(id, hashedPassword) {
    const user = await Usuario.findByIdAndUpdate(
      id,
      { $set: { senha: hashedPassword } }).select('-senha -refreshToken -accessToken');
    return user;
  }
}

export default UsuarioRepository;
