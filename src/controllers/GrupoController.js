import CommonResponse from "../utils/commonResponse.js";
import GrupoService from "../services/GrupoService.js";

class GrupoController {
  static listarGrupos = async (req, res, next) => {
    try {
      const response = await GrupoService.listarGrupos(req.query);
      res.status(200).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
  static criar = async (req, res, next) => {
    try {
      const response = await GrupoService.criar(req.body);
      res.status(201).json(CommonResponse.success(response));
    } catch (error) {
      next(error);
    }
  };
  static atualizar = async (req, res, next) => {
    try { 
      const updatedGroup = await GrupoService.atualizar(req.params.id, req.body)
      res.status(200).json(CommonResponse.success(updatedGroup, "Grupo atualizado!"));
    } catch (error) {
      next(error);
    }
  };
  static deletar = async (req, res, next) => {
    try {
      await GrupoService.deletar(req.params.id)
      res.status(200).json(CommonResponse.success([],"Grupo deletado com sucesso!"));
    } catch (error) {
      next(error);
    }
  };
}

export default GrupoController;