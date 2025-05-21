
import RefeicaoService from "../services/RefeicaoService.js";
import CommonResponse from "../utils/commonResponse.js";
import messages from "../utils/messages.js";

class RefeicaoController {
  // Método para registrar uma refeição de um estudante por um usuário autenticado
  static inserir = async (req, res, next) => {
    try {
      const { matricula } = req.body;
      const usuario = req.user._id;

      await RefeicaoService.inserir(matricula, usuario); // Executa o registro

      // Retorna sucesso com total atualizado
      res.status(201).json(CommonResponse.created(messages.success.success));
    } catch (error) {
      next(error); // Usa o middleware de erro global
    }
  };

  // Método para gerar um relatório de refeições com base em filtros e intervalo de datas
  static Relatorio = async (req, res, next) => {
    try {
      const { dataInicio, dataTermino, ...filtros } = req.query;

      const relatorio = await RefeicaoService.relatorio(
        dataInicio,
        dataTermino,
        filtros
      );

      // Retorna o relatório gerado com sucesso
      res.status(200).json(CommonResponse.success(relatorio));
    } catch (error) {
      next(error);
    }
  };
}

export default RefeicaoController;
