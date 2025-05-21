import CommonResponse from "../utils/commonResponse.js";
import RotaService from "../services/RotaService.js";

class RotaController {
  static listarRotas = async (req, res, next) => {
    try {
      const response = await RotaService.listarRotas(req.query);
      res.status(200).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
  static criar = async (req, res, next) => {
    try {
      const response = await RotaService.criar(req.body);
      res.status(201).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
  static atualizar = async (req, res, next) => {
    try {
      const updatedRoute = await RotaService.atualizar(req.params.id, req.body)
      res.status(200).json(CommonResponse.success(updatedRoute, "Rota atualizado!"));
    } catch (error) {
      next(error);
    }
  };
  static deletar = async (req, res, next) => {
    try {
      await RotaService.deletar(req.params.id)
      res.status(200).json(CommonResponse.success([], "Rota deletada com sucesso!"));
    } catch (error) {
      next(error);
    }
  };
}

export default RotaController;