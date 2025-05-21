import EstudanteService from "../services/EstudanteService.js";
import CommonResponse from "../utils/commonResponse.js";
import messages from "../utils/messages.js";

class EstudanteController {
  static ListarEstudantes = async (req, res, next) => {
    try {
      const estudantes = await EstudanteService.listarEstudantes(req.query);
      res.status(200).json(CommonResponse.success(estudantes));
    } catch (error) {
      next(error);
    }
  };

  static ListarEstudantePorId = async (req, res, next) => {
    try {
      const estudante = await EstudanteService.listarEstudantePorId(req.params);
      res.status(200).json(CommonResponse.success(estudante));
    } catch (error) {
      next(error);
    }
  };

  static AdicionarEstudante = async (req, res, next) => {
    try {
      const estudante = await EstudanteService.criarEstudante(req.body);
      res.status(201).json(CommonResponse.success(estudante, messages.success.success));
    } catch (error) {
      next(error);
    }
  };

  static AtualizarEstudante = async (req, res, next) => {
    try { 
      const estudanteAtualizado = await EstudanteService.AtualizarEstudante(req.params.id, req.body)
      res.status(200).json(CommonResponse.success(estudanteAtualizado, messages.success.success));
    } catch (error) {
      next(error);
    }
  };

  static DeletarEstudante = async (req, res, next) => {
    try {
      const estudante = await EstudanteService.DeletarEstudante(req.params.id)
      res.status(200).json(CommonResponse.success([],messages.success.success));
    } catch (error) {
      next(error);
    }
  };

  /**
   *  Para executar essa caceta coloque NO BODY:
   *  {
   *   "confirmacao": true
   *  } 
   */
  static InativarEstudantes = async (req, res, next) => {
    try {
      await EstudanteService.InativarEstudantes(req.body);
      res.status(200).json(CommonResponse.success( messages.success.success));
    } catch (error) {
      next(error);
    }
  };
  
}

export default EstudanteController;
