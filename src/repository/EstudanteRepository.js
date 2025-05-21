// src/repositories/EstudanteRepository.js
import EstudanteModel from '../models/Estudante.js';
import TurmaModel from "../models/Turma.js";

class EstudanteRepository {
  static async listarEstudantes(data) {
    const { nome, matricula, turma,curso, ativo, limite, pagina } = data;
    const filter = {};
    const limit = parseInt(limite) || 10;
    const page = parseInt(pagina) || 1;

    if (nome) {
      filter.nome = { $regex: new RegExp(nome, "i") };
    }
    if (matricula) {
      filter.matricula = matricula;
    }
    if (turma) {
      filter.turma = turma;
    }
    if (curso) {
      filter.curso = curso;
    }

    if (ativo !== undefined) {
      if (ativo === 'true') {
        filter.ativo = true;
      } else if (ativo === 'false') {
        filter.ativo = false;
      } else {
        filter.ativo = Boolean(ativo);
      }
    }

    // Paginação, mais o join com a turma e o curso
    const estudantes = await EstudanteModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id nome matricula ativo')
      .populate({
        path: 'turma',
        select: '_id descricao',
      })
      .populate({
        path: 'curso',
        select: 'nome contra_turnos',
      });

    // Contagem total para paginação
    const total = await EstudanteModel.countDocuments(filter);

    const response = { data: estudantes, total, limit, totalPages: Math.ceil(total / limit), page };
    return response
  }

  static async listarEstudantesPorId(data) {
    const estudante = await EstudanteModel
      .findById(data.id)
      .select('_id nome matricula ativo')
      .populate({
        path: 'turma',
        select: '_id descricao',
        populate: {
          path: 'curso',
          select: 'nome contra_turnos',
        },
      });

    return estudante;
  }

  static async criarEstudante(data) {
    const turmaBanco = await TurmaModel.findById(data.turma);

    if (!turmaBanco) {
      throw {
        message: "turma",
        code: 404
      }
    }
    const EstudanteExiste = await EstudanteModel.findOne({
      matricula: data.matricula,
    });

    if (EstudanteExiste) {
      throw {
        message: "matricula",
        code: 409
      }
    }

    const novoEstudante = await EstudanteModel.create(data).then((estudante) =>
      estudante.populate({
        path: "turma",
        select: "_id descricao",
        populate: { path: "curso", select: "nome contra_turnos" },
      })
    );
    return novoEstudante;
  }

  static async atualizarEstudante(data) {
    const { id, ...novosDados } = data;

    const estudanteAtual = await EstudanteModel.findById(id);

    if (!estudanteAtual) {
      throw {
        message: "Estudante não encontrado",
        code: 404
      }
    }

    if (novosDados.turma) {
      const turma = await TurmaModel.findById(novosDados.turma);
      if (!turma) {
        throw {
          message: "turma",
          code: 404
        }
      }
    }
    const dadosIguais = Object.keys(novosDados).every((campo) => {
      return estudanteAtual[campo]?.toString() === novosDados[campo]?.toString();
    });

    if (dadosIguais) {
      throw {
        message: "Dados iguais aos presentes no banco de dados",
        code: 409
      }
    }

    const estudanteAtualizado = await EstudanteModel.findByIdAndUpdate(id, novosDados, { new: true }).populate({
      path: "turma",
      select: "_id descricao",
      populate: { path: "curso", select: "nome contra_turnos" },
    });

    return estudanteAtualizado;
  }
  static async DeletarEstudante(id) {
    const estudanteDeletado = await EstudanteModel.findByIdAndDelete({ _id: id })
      .select('_id nome matricula')
    return estudanteDeletado;
  }

  static async inativarEstudantes() {
    const estudantesAtivos = await EstudanteModel.find({ ativo: true }).countDocuments();
    if (estudantesAtivos === 0) {
      throw {
        message: "Todos os estudantes já estão inativos.",
        code: 409,
      };
    }

    await EstudanteModel.updateMany({}, { ativo: false });

    const estudanteInativos = await EstudanteModel.find({ ativo: false }).select('nome matricula ativo');
    return estudanteInativos;
  }
  static async refeicaoEstudante(data) {

    const estudante = await EstudanteModel
      .findOne({ data }) // você pode pegar isso de req.query.matricula, por exemplo
      .select('_id matricula nome ativo') // seleciona apenas os campos desejados do estudante
      .populate({
        path: 'turma',
        select: '_id', // só queremos o _id da turma
        populate: {
          path: 'curso',
          select: '_id contra_turnos', // campos desejados do curso
        },
      });
    return estudante
  }
}

export default EstudanteRepository;
