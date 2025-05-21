// Importações de bibliotecas e módulos
import bcrypt from "bcryptjs"; // Para hash de senhas
import jwt from "jsonwebtoken"; // Para geração de tokens JWT
import Usuario from "../models/Usuario.js"; // Modelo de Usuário
import UsuarioService from "../services/UsuarioService.js"; // Importação do UsuarioService
import usuarioSchema from "../schemas/usuarioSchema.js"; // Schemas de validação
import CommonResponse from "../utils/commonResponse.js"; // Padronização de respostas
import messages from "../utils/messages.js"; // Mensagens padronizadas

class UsuarioController {
  /**
   * Lista todos os usuários com paginação
   */
  static ListarUsuarios = async (req, res, next) => {
    try {
        
      // Chama o serviço para listar os usuários com os parâmetros validados
      const usuarios = await UsuarioService.listarUsuarios(req.query);
  
      // Retorna a lista de usuários
      res.status(200).json(CommonResponse.success(usuarios));
    } catch (error) {
      // Passa o erro para o middleware de tratamento
      next(error);
    }
  };

  /**
   * Busca um usuário por ID
   */
  static ListarUsuarioPorId = async (req, res, next) => {
    try {
      const { id } = req.params;

      // Busca usuário excluindo a senha
      const usuario = await UsuarioService.buscarPorId(id);
  
      // Se não encontrado, retorna erro 404 padronizado
      if (!usuario) {
        res.status(404).json(CommonResponse.notFound(messages.error.resourceNotFound("Usuário")));
        return;
      }
  
      // Retorna usuário encontrado
      res.status(200).json(CommonResponse.success(usuario));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cadastra um novo usuário
  */
  static CadastrarUsuario = async (req, res, next) => {
    try {
      const usuario = await UsuarioService.criar(req.body);
      const { senha, ...usuarioSemSenha } = usuario.toObject();
      res.status(201).json(CommonResponse.success(usuarioSemSenha, messages.success.success));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Atualiza um usuário existente
   */
  static AtualizarUsuario = async (req, res, next) => {
    try {
      const { id } = req.params; // Extrai o ID dos parâmetros da rota
      const data = req.body; // Extrai os dados do corpo da requisição
  
      // Chama o serviço para atualizar o usuário
      const usuarioAtualizado = await UsuarioService.atualizar(id, data);
  
      // Retorna o usuário atualizado
      res.status(200).json(CommonResponse.success(usuarioAtualizado, messages.success.success));
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento de erros
    }
  };

  /**
   * Remove um usuário
   */
  static DeletarUsuario = async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await UsuarioService.deletar(id);
      // Retorna sucesso sem conteúdo
      res.status(200).json(CommonResponse.success(null, messages.success.success));
    } catch (error) {
      next(error);
    }
  };
}

export default UsuarioController;