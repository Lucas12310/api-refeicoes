import CommonResponse from "../utils/commonResponse.js";
import PermissoesService from "../services/PermissoesService.js";

class PermissoesController {
  static listarPermissoes = async (req, res, next) => {
    try {
      const response = await PermissoesService.listarPermissoes(req.query);
      res.status(200).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
  static criar = async (req, res, next) => {
    try {
      const response = await PermissoesService.criar(req.body);
      res.status(201).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };

  static atualizar = async (req, res, next) => {
    try {
      const updatedPermission = await PermissoesService.atualizar(req.params.id, req.body);
      res.status(200).json(CommonResponse.success(updatedPermission, "Permissão atualizada!"));
    } catch (error) {
      next(error);
    }
  };

  static deletar = async (req, res, next) => {
    try {
      await PermissoesService.deletar(req.params.id);
      res.status(200).json(CommonResponse.success([], "Permissão deletada com sucesso!"));
    } catch (error) {
      next(error);
    }
  };
}

export default PermissoesController;