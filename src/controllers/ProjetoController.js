import CommonResponse from "../utils/commonResponse.js";
import messages from "../utils/messages.js";
import ProjetoService from "../services/ProjetoService.js";

class ProjetoController {
  static listar = async (req, res, next) => {
    try {
      const response = await ProjetoService.listar(req.query, req.query.page, req.query.limit);
      res.status(200).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
  static inserir = async (req, res, next) => {
    try {
      const response = await ProjetoService.inserir(req.body);
      res.status(201).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };

  static atualizar = async (req, res,next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const response = await ProjetoService.atualizar(id ,data);
      res.status(200).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };

  static excluir = async (req, res,next) => {
    try {
      const { id } = req.params;
      const response = await ProjetoService.excluir(id);
      res.status(204).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
}

export default ProjetoController;
