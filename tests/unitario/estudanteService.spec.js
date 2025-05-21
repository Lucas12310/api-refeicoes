import { expect, describe, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../src/repository/EstudanteRepository.js', () => ({
  default: {
    listarEstudantes: jest.fn(),
    listarEstudantesPorId: jest.fn(),
    criarEstudante: jest.fn(),
    atualizarEstudante: jest.fn(),
    inativarEstudantes: jest.fn(),
    DeletarEstudante: jest.fn(),

  },
}));

jest.unstable_mockModule('../../src/schemas/estudantesSchema.js', () => ({
  default: {
    listarEstudantes: {
      parse: jest.fn(),
    },
    buscarEstudantePorId: {
      parse: jest.fn(),
    },
    criarEstudante: {
      parse: jest.fn(),
    },
    atualizarEstudante: {
      parse: jest.fn(),
    },
    inativarEstudantes: {
      parse: jest.fn(),
    },
    deletarEstudante: {
      parse: jest.fn(),
    },
  },
}));

const EstudanteService = (await import('../../src/services/EstudanteService.js')).default;
const EstudanteRepository = (await import('../../src/repository/EstudanteRepository.js')).default;
const EstudanteSchema = (await import('../../src/schemas/estudantesSchema.js')).default;

describe('EstudanteService - listarEstudantes', () => {
  it('deve retornar os dados quando os filtros são válidos', async () => {
    const queryParams = { nome: 'João', turma: 'Turma A' };
    const filtrosValidados = { nome: 'João', turma: 'Turma A' };
    const response = {
      data: [{ id: 1, nome: 'João', turma: 'Turma A' }],
    };

    EstudanteSchema.listarEstudantes.parse.mockReturnValue(filtrosValidados);
    EstudanteRepository.listarEstudantes.mockResolvedValue(response);

    const result = await EstudanteService.listarEstudantes(queryParams);

    expect(EstudanteSchema.listarEstudantes.parse).toHaveBeenCalledWith(queryParams);
    expect(EstudanteRepository.listarEstudantes).toHaveBeenCalledWith(filtrosValidados);
    expect(result).toEqual(response);
  });

  it('deve funcionar mesmo se queryParams for undefined', async () => {
    const filtrosValidados = {};
    const response = {
      data: [{ id: 2, nome: 'Maria' }]
    };

    EstudanteSchema.listarEstudantes.parse.mockReturnValue(filtrosValidados);
    EstudanteRepository.listarEstudantes.mockResolvedValue(response);

    const result = await EstudanteService.listarEstudantes(undefined);

    expect(EstudanteSchema.listarEstudantes.parse).toHaveBeenCalledWith({});
    expect(result).toEqual(response);
  });

  it('deve lançar erro 404 se response.data for array vazio', async () => {
    const queryParams = { nome: 'Lucas' };
    const filtrosValidados = { nome: 'Lucas' };
    const response = { data: [] };

    EstudanteSchema.listarEstudantes.parse.mockReturnValue(filtrosValidados);
    EstudanteRepository.listarEstudantes.mockResolvedValue(response);

    await expect(EstudanteService.listarEstudantes(queryParams))
      .rejects.toEqual({ code: 404 });
  });

  it('deve lançar erro 404 se response.data for undefined', async () => {
    const queryParams = { nome: 'Lucas' };
    const filtrosValidados = { nome: 'Lucas' };
    const response = { data: undefined };

    EstudanteSchema.listarEstudantes.parse.mockReturnValue(filtrosValidados);
    EstudanteRepository.listarEstudantes.mockResolvedValue(response);

    await expect(EstudanteService.listarEstudantes(queryParams))
      .rejects.toEqual({ code: 404 });
  });

  it('deve propagar erro se schema de validação lançar exceção', async () => {
    const queryParams = { nome: 123 }; // inválido
    const validationError = new Error('Erro de validação');

    EstudanteSchema.listarEstudantes.parse.mockImplementation(() => {
      throw validationError;
    });

    await expect(EstudanteService.listarEstudantes(queryParams))
      .rejects.toThrow('Erro de validação');
  });
  it('deve filtrar por matrícula corretamente', async () => {
    const queryParams = { matricula: '1234567890123' };
    const filtrosValidados = { matricula: '1234567890123' };
    const response = {
      data: [{ id: 3, nome: 'Pedro', matricula: '1234567890123' }]
    };

    EstudanteSchema.listarEstudantes.parse.mockReturnValue(filtrosValidados);
    EstudanteRepository.listarEstudantes.mockResolvedValue(response);

    const result = await EstudanteService.listarEstudantes(queryParams);

    expect(EstudanteSchema.listarEstudantes.parse).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual(response);
  });

  it('deve filtrar por ativo como true', async () => {
    const queryParams = { ativo: 'true' };
    const filtrosValidados = { ativo: 'true' };
    const response = {
      data: [{ id: 4, nome: 'Ana', ativo: true }]
    };

    EstudanteSchema.listarEstudantes.parse.mockReturnValue(filtrosValidados);
    EstudanteRepository.listarEstudantes.mockResolvedValue(response);

    const result = await EstudanteService.listarEstudantes(queryParams);

    expect(EstudanteSchema.listarEstudantes.parse).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual(response);
  });

  it('deve aplicar paginação corretamente', async () => {
    const queryParams = { pagina: '2', limite: '5' };
    const filtrosValidados = { pagina: 2, limite: 5 };
    const response = {
      data: [
        { id: 5, nome: 'Carlos' },
        { id: 6, nome: 'Luana' }
      ],
      total: 15,
      limit: 5,
      page: 2,
      totalPages: 3
    };

    EstudanteSchema.listarEstudantes.parse.mockReturnValue(filtrosValidados);
    EstudanteRepository.listarEstudantes.mockResolvedValue(response);

    const result = await EstudanteService.listarEstudantes(queryParams);

    expect(EstudanteSchema.listarEstudantes.parse).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual(response);
  });

  it('deve filtrar por curso se ID válido for informado', async () => {
    const cursoId = '5f4dcc3b5aa765d61d8327de';
    const queryParams = { curso: cursoId };
    const filtrosValidados = { curso: cursoId };
    const response = {
      data: [{ id: 7, nome: 'Fernanda', curso: cursoId }]
    };

    EstudanteSchema.listarEstudantes.parse.mockReturnValue(filtrosValidados);
    EstudanteRepository.listarEstudantes.mockResolvedValue(response);

    const result = await EstudanteService.listarEstudantes(queryParams);

    expect(EstudanteSchema.listarEstudantes.parse).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual(response);
  });

});

describe('EstudanteService - listarEstudantePorId', () => {

  it('deve retornar estudante ao encontrar por ID válido', async () => {
    const id = '64e9fa0dc9f68b34891a9abc';
    const estudante = {
      _id: id,
      nome: "Maria",
      matricula: "20231234",
      ativo: true,
    };

    EstudanteSchema.buscarEstudantePorId.parse.mockReturnValue({ id });
    EstudanteRepository.listarEstudantesPorId.mockResolvedValue(estudante);

    const resultado = await EstudanteService.listarEstudantePorId(id);
    expect(resultado).toEqual(estudante);
    expect(EstudanteRepository.listarEstudantesPorId).toHaveBeenCalledWith({ id });
  });

  it('deve lançar erro 404 se estudante não for encontrado', async () => {
    const id = '64e9fa0dc9f68b34891a9abc';

    EstudanteSchema.buscarEstudantePorId.parse.mockReturnValue({ id });
    EstudanteRepository.listarEstudantesPorId.mockResolvedValue(null);

    await expect(EstudanteService.listarEstudantePorId(id)).rejects.toEqual({
      message: "Estudante não encontrado",
      code: 404,
    });
  });

  it('deve lançar erro se ID for inválido (menos de 24 caracteres)', async () => {
    const id = '123';
    const erro = new Error("O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).");

    EstudanteSchema.buscarEstudantePorId.parse.mockImplementation(() => { throw erro });

    await expect(EstudanteService.listarEstudantePorId(id)).rejects.toThrow(erro.message);
  });
});

describe('EstudanteService - criarEstudante', () => {
  it('deve criar um novo estudante com dados válidos', async () => {
    const dataEntrada = {
      nome: "João",
      matricula: "20230001",
      turma: "64e9fa0dc9f68b34891a9abc",
    };

    const dataValidada = { ...dataEntrada, ativo: true };

    const estudanteCriado = {
      _id: "64e9fabcabcabcabcabc1234",
      ...dataValidada,
      turma: {
        _id: dataEntrada.turma,
        descricao: "Turma A",
        curso: { nome: "Curso Teste", contra_turnos: false },
      },
    };

    EstudanteSchema.criarEstudante.parse.mockReturnValue(dataValidada);
    EstudanteRepository.criarEstudante.mockResolvedValue(estudanteCriado);

    const resultado = await EstudanteService.criarEstudante(dataEntrada);

    expect(resultado).toEqual(estudanteCriado);
    expect(EstudanteSchema.criarEstudante.parse).toHaveBeenCalledWith(dataEntrada);
    expect(EstudanteRepository.criarEstudante).toHaveBeenCalledWith(dataValidada);
  });

  it('deve lançar erro se dados forem inválidos', async () => {
    const entradaInvalida = { nome: "", matricula: "", turma: "123" };
    const erro = new Error("Nome é obrigatório e deve conter pelo menos 1 caractere.");

    EstudanteSchema.criarEstudante.parse.mockImplementation(() => { throw erro });

    await expect(EstudanteService.criarEstudante(entradaInvalida)).rejects.toThrow(erro.message);
  });
});
describe('EstudanteService - InativarEstudantes', () => {

  it('deve inativar todos os estudantes quando confirmação for verdadeira e houver estudantes ativos', async () => {
    const input = { confirmacao: true };
    const estudantesInativados = [
      { nome: "João", matricula: "123", ativo: false },
      { nome: "Maria", matricula: "456", ativo: false },
    ];

    EstudanteSchema.inativarEstudantes.parse.mockReturnValue(input);
    EstudanteRepository.inativarEstudantes.mockResolvedValue(estudantesInativados);

    const result = await EstudanteService.InativarEstudantes(input);

    expect(EstudanteSchema.inativarEstudantes.parse).toHaveBeenCalledWith(input);
    expect(EstudanteRepository.inativarEstudantes).toHaveBeenCalled();
    expect(result).toEqual(estudantesInativados);
  });

  it('deve lançar erro 409 se todos os estudantes já estiverem inativos', async () => {
    const input = { confirmacao: true };

    EstudanteSchema.inativarEstudantes.parse.mockReturnValue(input);
    EstudanteRepository.inativarEstudantes.mockRejectedValue({
      message: "Todos os estudantes já estão inativos.",
      code: 409,
    });

    await expect(EstudanteService.InativarEstudantes(input))
      .rejects.toEqual({ message: "Todos os estudantes já estão inativos.", code: 409 });
  });

  it('deve lançar erro se a confirmação for falsa', async () => {
    const input = { confirmacao: false };
    const error = new Error("Confirmação deve ser verdadeira para inativar estudantes.");

    EstudanteSchema.inativarEstudantes.parse.mockImplementation(() => {
      throw error;
    });

    await expect(EstudanteService.InativarEstudantes(input)).rejects.toThrow("Confirmação deve ser verdadeira para inativar estudantes.");
  });

  it('deve lançar erro se o campo "confirmacao" não for booleano', async () => {
    const input = { confirmacao: "sim" };
    const error = new Error("Confirmação deve ser um valor booleano.");

    EstudanteSchema.inativarEstudantes.parse.mockImplementation(() => {
      throw error;
    });

    await expect(EstudanteService.InativarEstudantes(input)).rejects.toThrow("Confirmação deve ser um valor booleano.");
  });
});

describe('EstudanteService - DeletarEstudante', () => {

  it('deve deletar um estudante com ID válido', async () => {
    const id = '64e9fa0dc9f68b34891a9abc';
    const estudanteDeletado = {
      _id: id,
      nome: "João da Silva",
      matricula: "20230001",
    };

    EstudanteSchema.deletarEstudante.parse.mockReturnValue(id);
    EstudanteRepository.DeletarEstudante.mockResolvedValue(estudanteDeletado);

    const resultado = await EstudanteService.DeletarEstudante(id);

    expect(EstudanteSchema.deletarEstudante.parse).toHaveBeenCalledWith(id);
    expect(EstudanteRepository.DeletarEstudante).toHaveBeenCalledWith(id);
    expect(resultado).toEqual(estudanteDeletado);
  });

  it('deve lançar erro 404 se o estudante não for encontrado', async () => {
    const id = '64e9fa0dc9f68b34891a9abc';

    EstudanteSchema.deletarEstudante.parse.mockReturnValue(id);
    EstudanteRepository.DeletarEstudante.mockResolvedValue(null);

    await expect(EstudanteService.DeletarEstudante(id))
      .rejects.toEqual({ code: 404 });
  });

  it('deve lançar erro se o ID for inválido (menor que 24 chars)', async () => {
    const idInvalido = '123abc';
    const erro = new Error("O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).");

    EstudanteSchema.deletarEstudante.parse.mockImplementation(() => {
      throw erro;
    });

    await expect(EstudanteService.DeletarEstudante(idInvalido)).rejects.toThrow("O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).");
  });

  it('deve lançar erro se o ID não for uma string', async () => {
    const idInvalido = 123456;
    const erro = new Error("O ID precisa ser definido como uma string/texto. (Neste caso seria um ObjectId no mongoDB)");

    EstudanteSchema.deletarEstudante.parse.mockImplementation(() => {
      throw erro;
    });

    await expect(EstudanteService.DeletarEstudante(idInvalido)).rejects.toThrow("O ID precisa ser definido como uma string/texto. (Neste caso seria um ObjectId no mongoDB)");
  });
});

describe("EstudanteService - AtualizarEstudante", () => {
  const id = "64e9fa0dc9f68b34891a9abc";

  it("deve atualizar o estudante com dados válidos", async () => {
    const data = { nome: "Novo Nome" };
    const dadosValidados = { id, ...data };
    const estudanteAtualizado = { _id: id, nome: "Novo Nome", matricula: "20230001" };

    EstudanteSchema.atualizarEstudante.parse.mockReturnValue(dadosValidados);
    EstudanteRepository.atualizarEstudante.mockResolvedValue(estudanteAtualizado);

    const resultado = await EstudanteService.AtualizarEstudante(id, data);

    expect(EstudanteSchema.atualizarEstudante.parse).toHaveBeenCalledWith({ id, ...data });
    expect(EstudanteRepository.atualizarEstudante).toHaveBeenCalledWith(dadosValidados);
    expect(resultado).toEqual(estudanteAtualizado);
  });

  it("deve lançar erro 404 se estudante não for encontrado", async () => {
    const data = { nome: "Novo Nome" };
    const dadosValidados = { id, ...data };

    EstudanteSchema.atualizarEstudante.parse.mockReturnValue(dadosValidados);
    EstudanteRepository.atualizarEstudante.mockRejectedValue({ message: "Estudante não encontrado", code: 404 });

    await expect(EstudanteService.AtualizarEstudante(id, data)).rejects.toEqual({ message: "Estudante não encontrado", code: 404 });
  });

  it("deve lançar erro 404 se turma informada não existir", async () => {
    const data = { turma: "64e9fa0dc9f68b34891a9def" };
    const dadosValidados = { id, ...data };

    EstudanteSchema.atualizarEstudante.parse.mockReturnValue(dadosValidados);
    EstudanteRepository.atualizarEstudante.mockRejectedValue({ message: "turma", code: 404 });

    await expect(EstudanteService.AtualizarEstudante(id, data)).rejects.toEqual({ message: "turma", code: 404 });
  });

  it("deve lançar erro 409 se os dados forem iguais aos do banco", async () => {
    const data = { nome: "João", matricula: "123" };
    const dadosValidados = { id, ...data };

    EstudanteSchema.atualizarEstudante.parse.mockReturnValue(dadosValidados);
    EstudanteRepository.atualizarEstudante.mockRejectedValue({ message: "Dados iguais aos presentes no banco de dados", code: 409 });

    await expect(EstudanteService.AtualizarEstudante(id, data)).rejects.toEqual({ message: "Dados iguais aos presentes no banco de dados", code: 409 });
  });

  it("deve lançar erro se o ID for inválido", async () => {
    const idInvalido = "123abc";
    const data = { nome: "Qualquer" };
    const erro = new Error("O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).");

    EstudanteSchema.atualizarEstudante.parse.mockImplementation(() => {
      throw erro;
    });

    await expect(EstudanteService.AtualizarEstudante(idInvalido, data)).rejects.toThrow("O campo 'id' deve ser um ID válido (HEXADECIMAL COM 24 CARACTERES).");
  });

  it("deve lançar erro se nenhum campo for passado para atualização", async () => {
    const data = {}; // vazio
    const erro = new Error("Nenhum campo fornecido para atualização.");

    EstudanteSchema.atualizarEstudante.parse.mockImplementation(() => {
      throw erro;
    });

    await expect(EstudanteService.AtualizarEstudante(id, data)).rejects.toThrow("Nenhum campo fornecido para atualização.");
  });
});