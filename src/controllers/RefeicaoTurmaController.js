import RefeicaoTurmaService from "../services/RefeicaoTurmaService.js";
import CommonResponse from "../utils/commonResponse.js";

class RefeicaoTurmaController {
  static async listarRefeicoesTurma(req, res, next) {
    try {
      const refeicoes = await RefeicaoTurmaService.listarRefeicoesTurma(req.query);
      res.status(200).json(CommonResponse.success(refeicoes));
    } catch (error) {
      next(error);
    }
  }

  static async listarRefeicaoTurmaPorId(req, res, next) {
    try {
      const refeicao = await RefeicaoTurmaService.listarRefeicaoTurmaPorId(req.params);
      res.status(200).json(CommonResponse.success(refeicao));
    } catch (error) {
      next(error);
    }
  }

  static async adicionarRefeicaoTurma(req, res, next) {
    try {
      const novaRefeicao = await RefeicaoTurmaService.criarRefeicaoTurma(req.body);
      res.status(201).json(CommonResponse.success(novaRefeicao));
    } catch (error) {
      next(error);
    }
  }

  static async atualizarRefeicaoTurma(req, res, next) {
    try {
      const refeicaoAtualizada = await RefeicaoTurmaService.atualizarRefeicaoTurma(req.params, req.body);
      res.status(200).json(CommonResponse.success(refeicaoAtualizada));
    } catch (error) {
      next(error);
    }
  }

  static async deletarRefeicaoTurma(req, res, next) {
    try {
      const refeicaoDeletada = await RefeicaoTurmaService.deletarRefeicaoTurma(req.params);
      res.status(200).json(CommonResponse.success(refeicaoDeletada));
    } catch (error) {
      next(error);
    }
  }
}

export default RefeicaoTurmaController;