import CommonResponse from "../utils/commonResponse.js";
import messages from "../utils/messages.js";
import CursoService from "../services/CursoService.js";

class CursoController {
  static listar = async (req, res, next) => {
    try {
      const response = await CursoService.listar(req.query, req.query.page, req.query.limit);
      res.status(200).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
  static inserir = async (req, res, next) => {
    try {
      const response = await CursoService.inserir(req.body);
      res.status(201).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };

  static atualizar = async (req, res,next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const response = await CursoService.atualizar(id ,data);
      res.status(200).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };

  static excluir = async (req, res,next) => {
    try {
      const { id } = req.params;
      const response = await CursoService.excluir(id);
      res.status(204).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
}

export default CursoController;
