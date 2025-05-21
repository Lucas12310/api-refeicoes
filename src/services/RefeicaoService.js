import RefeicaoRepository from "../repository/RefeicaoRepository.js";
import EstudanteRepository from "../repository/EstudanteRepository.js";
import RefeicaoTurmaRepository from "../repository/RefeicaoTurmaRepository.js";
import ProjetoRepository from "../repository/ProjetoRepository.js";
import EstagioRepository from "../repository/EstagioRepository.js";
import refeicaoSchema from "../schemas/refeiçaoSchema.js";

import { endOfDay, startOfDay, format } from "date-fns";
import mongoose from "mongoose";

class RefeicaoService {
  static async inserir(matricula, usuario) {
    matricula = refeicaoSchema.registrar.parse(matricula);
    const dataAtual = new Date();
    const semana = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const diaSemana = dataAtual.getDay();
    // formatando a hora do usuario para o horario de vilhena/RO, o sistema irá sempre seguir o horário de vha
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Porto_Velho',
      dateStyle: 'full',
      timeStyle: 'long'
    });
   
    const dataFormatMongo = formatter.format(dataAtual);
    const clean = dataFormatMongo.replace(/^.*?,\s*/, '').replace(' às ', ' ').replace(' AMT', '');

  // Mapeia meses em português para números
  const meses = {
    janeiro: '01',
    fevereiro: '02',
    março: '03',
    abril: '04',
    maio: '05',
    junho: '06',
    julho: '07',
    agosto: '08',
    setembro: '09',
    outubro: '10',
    novembro: '11',
    dezembro: '12'
  };

  // Extrai partes da data
  const regex = /(\d{2}) de (\w+) de (\d{4}) (\d{2}):(\d{2}):(\d{2})/;
  const match = clean.match(regex);

  const [_, dia, mesNome, ano, hora, minuto, segundo] = match;
  const mes = meses[mesNome.toLowerCase()];

  // Cria a data como se fosse no fuso UTC-4 (AMT)
  const dateInAMT = new Date(Date.UTC(
    parseInt(ano), 
    parseInt(mes) - 1, 
    parseInt(dia),
    parseInt(hora), // ajusta fuso UTC-4 para UTC
    parseInt(minuto),
    parseInt(segundo)
  ));
    let tipoRefeicao;
    let podeComer = false;
    const objmatricula = {matricula:matricula}
    const estudante = await EstudanteRepository.listarEstudantes(objmatricula);

    
    if (!estudante.data[0] || estudante.data.length === 0 ) {
      throw{
        message:"Estudante não encontrado!",
        code:404
      }
    }
    
    if (estudante.data[0].ativo == false) {
      throw{
        message:"Estudante não está ativo!",
        code:400
      }
    }
    
    // variaveis para verificar se o aluno pode almoçar com base em um contra turno especial/atipico
    const dataFormatada = dateInAMT.toISOString().split("T")[0];
    const dataInicioTurma = dataFormatada+"T00:00:00.000Z"
    const dataFimTurma = dataFormatada+"T23:59:59.999Z"
    const objIdEstudanteTurma = {
      turma:new mongoose.Types.ObjectId(estudante.data[0].turma.id),
      data_liberado:dataInicioTurma+","+dataFimTurma
    }
    // fim de verificação de turno especial

    // variaveis para verificar se o aluno ja almoçou
    const objJaAlmocou = {
      estudante:new mongoose.Types.ObjectId(estudante.data[0]._id),
      data:dataInicioTurma+","+dataFimTurma
    }
    
    //fim de verificação se aluno almoçou

    
    //verificando se o estudante ja almoçou hoje
    
    const validatedEstudanteAlmoçou = await RefeicaoRepository.find(objJaAlmocou)

    if(validatedEstudanteAlmoçou.data.length >= 1){
      throw{
        message:"Estudante já almoçou hoje!",
        code:400
      }
    }

    
    
    // verificando se pode almoçar por condição contra turno
    const turnoCurso = estudante.data[0].curso.contra_turnos[semana[diaSemana]];
    
    if (turnoCurso) {
      tipoRefeicao = "Contra-turno";
      podeComer = true;
    }
    const objIdEstudante = {estudantes:[estudante.data[0]._id]}
    // verificando se pode almoçar por condição projeto
    if (!podeComer) {
      // verificando se o aluno pode almoçar com base no projeto que ele esta ou se ele esta em varios projetos
      const projetos = await ProjetoRepository.listar(objIdEstudante);
      if(!projetos.data || projetos.data.length > 0){
        for(let i = 0;i<projetos.data.length;i++){
          if(projetos.data[i].status == "Em andamento"){
            let turnoProjeto = projetos.data[i].turnos[semana[diaSemana]]
            if(turnoProjeto){
              tipoRefeicao = "Projeto";
              podeComer = true;
              break
            }
          }
        }
      }
    }
   // verificando se o aluno pode almoçar com base no estagio
   const objIdEstudanteEstagio = {estudante:[estudante.data[0]._id]}
    if (!podeComer) { 
      const estagio = await EstagioRepository.buscarEstagioEstudante(objIdEstudanteEstagio);
      if(estagio.length > 0){
        if(estagio[0].status == "Em andamento"){
          let turnoEstagio = estagio[0].turnos[semana[diaSemana]]
          if(turnoEstagio){
            tipoRefeicao = "Estágio";
            podeComer = true;
          } 
        }
      }
    }
    // verificando se o aluno pode almoçar com base se a turma dele tem um contra-turno especial
    //console.log(objIdEstudanteTurma)
    if (!podeComer) {
      const refeicoesTurma = await RefeicaoTurmaRepository.listarRefeicaoAtipica(objIdEstudanteTurma);
        if(refeicoesTurma.data.length >= 1){
          tipoRefeicao = "Turma";
          podeComer = true;
        }
      
    }
 
    if(podeComer == false){
      throw{
        message:"Estudante não pode almoçar hoje",
        code:404
      }
    }

    
 

    const novaRefeicao = {
      estudante: {
        _id:estudante.data[0]._id,
        nome: estudante.data[0].nome,
        matricula: estudante.data[0].matricula,
        curso: estudante.data[0].curso.nome,
        turma: estudante.data[0].turma.descricao,
      },
      tipoRefeicao,
      data: dateInAMT,
      usuarioRegistrou: new mongoose.Types.ObjectId(usuario),
    };
    
    await RefeicaoRepository.create(novaRefeicao);
    
  }
    
  static async relatorio(dataInicio, dataTermino, filtros) {
    const query = refeicaoSchema.relatorio.parse({dataInicio, dataTermino, ...filtros});
    dataInicio = dataInicio+"T00:00:00.000Z"
    dataTermino = dataTermino+"T23:59:59.999Z"
    const response = await RefeicaoRepository.relatorio(dataInicio, dataTermino, filtros);
    //console.log(response)
    return response
  }

}

export default RefeicaoService;
