import ProjetoRepository from '../repository/ProjetoRepository.js';
import projetoSchema from "../schemas/projetoSchema.js"

class ProjetoService {
  static async listar(filtro, page = 1, limit = 10) {
    /*if(filtro.data_inicio)  {
      filtro.data_inicio = new Date(filtro.data_inicio)
      filtro.data_inicio.setUTCHours(0, 0, 0, 0); 
    }*/
    const validatedFilter = projetoSchema.projetoListSchema.parse(filtro);
    const response = await ProjetoRepository.listar(validatedFilter, page, limit);
    return response;
  }

  static async inserir(data) {
    const cont = Object.keys(data.estudantes).length
    /*
    for (let i = 0; i < cont; i++) {
      let validateduser = await ProjetoRepository.buscarEstudante(data.estudantes.matricula[i])
      console.log(validateduser)
    }
      */
    data.data_inicio = new Date(data.data_inicio)
    data.data_termino = new Date(data.data_termino)
    const validatedData = projetoSchema.projetoCreateSchema.parse(data);
    const response = await ProjetoRepository.inserir(validatedData);
    return response;
  }

  static async atualizar(id, data) {
    const validatedId = projetoSchema.objectIdSchema.parse(id)
    const validatedData = projetoSchema.projetoUpdateSchema.parse(data);
    const projectExist = await ProjetoRepository.listarID(validatedId)
    if(projectExist == null){
      throw {
        message:"Projeto não encontrado!",
        code:404
      }
    }
    const response = await ProjetoRepository.atualizar(validatedId, validatedData);
    return response;
  }

  static async excluir(id) {
    const validatedId = projetoSchema.objectIdSchema.parse(id)
    const projectExist = await ProjetoRepository.listarID(validatedId)
    if(projectExist == null){
      throw {
        message:"Projeto não encontrado!",
        code:404
      }
    }
    const response = await ProjetoRepository.excluir(validatedId);
    return response;
  }
}

export default ProjetoService;