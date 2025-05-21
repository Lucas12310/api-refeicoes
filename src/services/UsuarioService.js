import UsuarioRepository from "../repository/UsuarioRepository.js";
import usuarioSchema from "../schemas/usuarioSchema.js";
import bcrypt from "bcryptjs";
import GrupoRepository from "../repository/GrupoRepository.js";

class UsuarioService {
  static async criar(dadosUsuario) {
    const usuario = usuarioSchema.cadastrarUsuario.parse(dadosUsuario);

    // Fetch the group by name
    const grupo = await GrupoRepository.listarGrupos({ nome: usuario.grupo });
    if (!grupo.data.length) {
      throw { code: 404, message: "Grupo não encontrado com o nome fornecido." };
    }

    // Use the group ID for the user
    usuario.grupo = grupo.data[0]._id;
    usuario.ativo = true;

    const usuarioExistente = await UsuarioRepository.findByEmail(usuario.email);
    if (usuarioExistente) {
      throw { code: 409, message: "Usuário já cadastrado com este email" };
    }

    usuario.senha = await bcrypt.hash(usuario.senha, 10);
    const novoUsuario = await UsuarioRepository.create(usuario);

    return novoUsuario;
  }

  static async autenticar(email, senha) {
    const usuario = await UsuarioRepository.buscarPorEmail(email);
    if (!usuario) throw new Error("Usuário não encontrado");

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("Senha incorreta");

    return usuario;
  }

  static async listarUsuarios(data) {    
    const queryParams = usuarioSchema.listarUsuarios.parse(data);
    const response = await UsuarioRepository.listarUsuarios(queryParams);
    
    if (!response.data.length) {
      throw { code: 404, message: "Nenhum usuário encontrado." };
    }
    return response;
    
  }

  static async buscarPorId(id) {
    const params = usuarioSchema.listarUsuarioPorId.parse({ _id: id });
    const response = await UsuarioRepository.findById(params._id);
    if (!response) {
      return null;
    }
    return response;
}

static async atualizar(id, dadosAtualizados) {
  // Valida os dados de entrada
  const usuario = usuarioSchema.atualizarUsuario.parse({ id, ...dadosAtualizados });

  // Se senha foi fornecida, cria hash
  if (usuario.senha) {
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
  }

  // Atualiza o usuário no repositório
  const usuarioAtualizado = await UsuarioRepository.update(usuario.id, usuario);

  if (!usuarioAtualizado) {
    throw { code: 404, message: "Usuário não encontrado." };
  }

  return usuarioAtualizado;
}

static async deletar(id) {
  const idValidado = usuarioSchema.listarUsuarioPorId.parse({ _id: id });
  const UsuarioDelete = await UsuarioRepository.delete(idValidado);

  console.log("boi", UsuarioDelete);
  
  return UsuarioDelete;
}

}

export default UsuarioService;
