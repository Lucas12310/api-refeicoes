import EstagioService from "../services/EstagioService.js";
import CommonResponse from "../utils/commonResponse.js";
import messages from "../utils/messages.js";

class EstagioController {
  static ListarEstagios = async (req, res, next) => {
    try {
      const estagios = await EstagioService.listarEstagios(req.query);
      res.status(200).json(CommonResponse.success(estagios));
    } catch (error) {
      next(error);
    }
  };
  static ListarEstagioPorId = async (req, res, next) => {
    try {
      const estagio = await EstagioService.listarEstagioPorId(req.params);
      res.status(200).json(CommonResponse.success(estagio));
    } catch (error) {
      next(error);
    }
  };

  static AdicionarEstagio = async (req, res, next) => {
    try {
      const estagio = await EstagioService.criarEstagio(req.body);
      res.status(201).json(CommonResponse.success(estagio, messages.success.success));
    } catch (error) {
      next(error);
    }
  };

  static AtualizarEstagio = async (req, res, next) => {
    try {
      const estagioAtualizado = await EstagioService.atualizarEstagio(req.params, req.body);

      res.status(200).json(CommonResponse.success(estagioAtualizado, messages.success.success));
    } catch (error) {
      next(error);
    }
  };

  static DeletarEstagio = async (req, res, next) => {
    try {
      const { id } = req.params;
      const estagioDeletado = await EstagioService.deletarEstagio(id);

      res.status(200).json(CommonResponse.success(estagioDeletado, messages.success.success));
    } catch (error) {
      next(error);
    }
  };
}

export default EstagioController;
