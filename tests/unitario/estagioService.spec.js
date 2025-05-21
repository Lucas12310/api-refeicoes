import { expect, describe, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../src/repository/EstagioRepository.js', () => ({
  default: {
    listarEstagios: jest.fn(),
    listarEstagioPorId: jest.fn(),
    criarEstagio: jest.fn(),
    atualizarEstagio: jest.fn(),
    deletarEstagio: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/schemas/estagiosSchema.js', () => ({
  default: {
    listarEstagios: {
      parse: jest.fn(),
    },
    buscarEstagioPorId: {
      parse: jest.fn(),
    },
    criarEstagio: {
      parse: jest.fn(),
    },
    atualizarEstagio: {
      parse: jest.fn(),
    },
    deletarEstagio: {
      parse: jest.fn(),
    },
  },
}));

const EstagioService = (await import('../../src/services/EstagioService.js')).default;
const EstagioRepository = (await import('../../src/repository/EstagioRepository.js')).default;
const EstagiosSchema = (await import('../../src/schemas/estagiosSchema.js')).default;

describe("EstagioService", () => {

  describe("listarEstagios", () => {
    it("deve retornar os estágios paginados corretamente", async () => {
      const queryParams = { pagina: 1, limite: 5, status: "Encerrado" };
      const queryParsed = { ...queryParams };

      const mockResponse = {
        data: [{ _id: "1", descricao: "Estágio X", status: "Encerrado" }],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      };

      EstagiosSchema.listarEstagios.parse.mockReturnValue(queryParsed);
      EstagioRepository.listarEstagios.mockResolvedValue(mockResponse);

      const result = await EstagioService.listarEstagios(queryParams);

      expect(EstagiosSchema.listarEstagios.parse).toHaveBeenCalledWith(queryParams);
      expect(EstagioRepository.listarEstagios).toHaveBeenCalledWith(queryParsed, 5, 1);
      expect(result).toEqual(mockResponse);
    });
    it("deve retornar os estágios com queryParams vazio", async () => {
      const queryParams = undefined; 
      const queryParsed = {};
  
      const mockResponse = {
        data: [{ _id: "1", descricao: "Estágio X", status: "Encerrado" }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
  
      EstagiosSchema.listarEstagios.parse.mockReturnValue(queryParsed);
      EstagioRepository.listarEstagios.mockResolvedValue(mockResponse);
  
      const result = await EstagioService.listarEstagios(queryParams);
  
      expect(EstagiosSchema.listarEstagios.parse).toHaveBeenCalledWith({});
      expect(EstagioRepository.listarEstagios).toHaveBeenCalledWith(queryParsed, 10, 1);
      expect(result).toEqual(mockResponse);
    });
    it("deve lançar erro 404 se nenhum estágio for encontrado", async () => {
      const queryParams = { pagina: 1, limite: 5 };
      const queryParsed = { ...queryParams };

      EstagiosSchema.listarEstagios.parse.mockReturnValue(queryParsed);
      EstagioRepository.listarEstagios.mockResolvedValue({ data: [] });

      await expect(EstagioService.listarEstagios(queryParams)).rejects.toEqual({
        code: 404,
        message: "Nenhum estágio encontrado.",
      });
    });
  });

  describe("listarEstagioPorId", () => {
    it("deve retornar um estágio se o ID for válido e encontrado", async () => {
      const idParams = { id: "60f6a5d5e6c2f9d4a4c1a1e2" };
      const estagioMock = {
        _id: "60f6a5d5e6c2f9d4a4c1a1e2",
        descricao: "Estágio A",
        status: "Em andamento",
      };

      EstagiosSchema.buscarEstagioPorId.parse.mockReturnValue(idParams);
      EstagioRepository.listarEstagioPorId.mockResolvedValue(estagioMock);

      const result = await EstagioService.listarEstagioPorId(idParams);

      expect(EstagiosSchema.buscarEstagioPorId.parse).toHaveBeenCalledWith(idParams);
      expect(EstagioRepository.listarEstagioPorId).toHaveBeenCalledWith(idParams.id);
      expect(result).toEqual(estagioMock);
    });

    it("deve lançar erro se o estágio não for encontrado", async () => {
      const idParams = { id: "60f6a5d5e6c2f9d4a4c1a1e2" };

      EstagiosSchema.buscarEstagioPorId.parse.mockReturnValue(idParams);
      EstagioRepository.listarEstagioPorId.mockResolvedValue(null);

      await expect(EstagioService.listarEstagioPorId(idParams))
        .rejects.toThrow("Estágio não encontrado.");
    });
  });
});

describe("criarEstagio", () => {
  it("deve criar um novo estágio com sucesso", async () => {
    const dadosEstagio = {
      estudante: "123456789012345678901234",
      data_inicio: "2025-04-01",
      data_termino: "2025-05-01",
      status: "Em andamento",
      turnos: {
        segunda: true,
        terca: false,
        quarta: false,
        quinta: false,
        sexta: true,
        sabado: false,
        domingo: false,
      },
      descricao: "Estágio Teste",
    };

    const estagioCriado = { _id: "1", ...dadosEstagio };

    EstagiosSchema.criarEstagio = { parse: jest.fn().mockReturnValue(dadosEstagio) };
    EstagioRepository.criarEstagio = jest.fn().mockResolvedValue(estagioCriado);

    const result = await EstagioService.criarEstagio(dadosEstagio);

    expect(EstagiosSchema.criarEstagio.parse).toHaveBeenCalledWith(dadosEstagio);
    expect(EstagioRepository.criarEstagio).toHaveBeenCalledWith(dadosEstagio);
    expect(result).toEqual(estagioCriado);
  });
});

describe("atualizarEstagio", () => {
  it("deve atualizar o estágio com sucesso", async () => {
    const id = { id: "60f6a5d5e6c2f9d4a4c1a1e2" };
    const dadosAtualizados = {
      descricao: "Estágio Atualizado",
    };

    const estagioMockAtualizado = {
      _id: id.id,
      descricao: "Estágio Atualizado",
    };

    const schemaMerged = { ...id, ...dadosAtualizados };

    EstagiosSchema.atualizarEstagio = { parse: jest.fn().mockReturnValue(schemaMerged) };
    EstagioRepository.atualizarEstagio = jest.fn().mockResolvedValue(estagioMockAtualizado);

    const result = await EstagioService.atualizarEstagio(id, dadosAtualizados);

    expect(EstagiosSchema.atualizarEstagio.parse).toHaveBeenCalledWith({ ...id, ...dadosAtualizados });
    expect(EstagioRepository.atualizarEstagio).toHaveBeenCalledWith(schemaMerged);
    expect(result).toEqual(estagioMockAtualizado);
  });
});

describe("deletarEstagio", () => {
  it("deve deletar o estágio com sucesso", async () => {
    const id = "60f6a5d5e6c2f9d4a4c1a1e2";
    const estagioDeletado = { _id: id, descricao: "Estágio Excluído" };

    EstagiosSchema.deletarEstagio = { parse: jest.fn().mockReturnValue({ id }) };
    EstagioRepository.deletarEstagio = jest.fn().mockResolvedValue(estagioDeletado);

    const result = await EstagioService.deletarEstagio(id);

    expect(EstagiosSchema.deletarEstagio.parse).toHaveBeenCalledWith({ id });
    expect(EstagioRepository.deletarEstagio).toHaveBeenCalledWith(id);
    expect(result).toEqual(estagioDeletado);
  });
});
