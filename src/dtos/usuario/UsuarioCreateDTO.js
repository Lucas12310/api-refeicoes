// filepath: h:\Thalysson\VisualCodeScripts\Codigos\refeicoes\back-end\src\dtos\usuario\UsuarioCreateDTO.js
export default class UsuarioCreateDTO {
  static create(data) {
    return {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      ativo: data.ativo,
      grupo: data.grupo,
    };
  }
}