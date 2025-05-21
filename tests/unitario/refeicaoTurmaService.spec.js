import { expect, describe, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../src/repository/RefeicaoTurmaRepository.js', () => ({
  default: {
    listarRefeicoesTurma: jest.fn(),
    listarRefeicaoTurmaPorId: jest.fn(),
    criarRefeicaoTurma: jest.fn(),
    atualizarRefeicaoTurma: jest.fn(),
    deletarRefeicaoTurma: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/schemas/refeicaoTurmaSchema.js', () => ({
  default: {
    listarRefeicoesTurma: {
      parse: jest.fn(),
    },
    buscarRefeicaoPorId: {
      parse: jest.fn(),
    },
    criarRefeicaoTurma: {
      parse: jest.fn(),
    },
    atualizarRefeicaoTurma: {
      parse: jest.fn(),
    },
    buscarRefeicaoPorId: {
      parse: jest.fn(),
    },
  },
}));

const RefeicaoTurmaService = (await import('../../src/services/RefeicaoTurmaService.js')).default;
const RefeicaoTurmaRepository = (await import('../../src/repository/RefeicaoTurmaRepository.js')).default;
const RefeicaoTurmaSchema = (await import('../../src/schemas/refeicaoTurmaSchema.js')).default;

describe("RefeicaoTurmaService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listarRefeicoesTurma", () => {
    it("deve retornar refeições paginadas corretamente", async () => {
      const queryParams = {
        turma: "60f6a5d5e6c2f9d4a4c1a1e2",
        pagina: 1,
        limite: 5,
        descricao: "Arroz",
      };
      const parsedQuery = { ...queryParams };

      const mockResponse = {
        data: [{ _id: "1", descricao: "Arroz", turma: { _id: "60f6a5d5e6c2f9d4a4c1a1e2" } }],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      };

      RefeicaoTurmaSchema.listarRefeicoesTurma.parse.mockReturnValue(parsedQuery);
      RefeicaoTurmaRepository.listarRefeicoesTurma.mockResolvedValue(mockResponse);

      const result = await RefeicaoTurmaService.listarRefeicoesTurma(queryParams);

      expect(RefeicaoTurmaSchema.listarRefeicoesTurma.parse).toHaveBeenCalledWith(queryParams);
      expect(RefeicaoTurmaRepository.listarRefeicoesTurma).toHaveBeenCalledWith(parsedQuery);
      expect(result).toEqual(mockResponse);
    });

    it("deve lançar erro 404 se nenhuma refeição for encontrada", async () => {
      const queryParams = { pagina: 1, limite: 5 };
      const parsedQuery = { ...queryParams };

      RefeicaoTurmaSchema.listarRefeicoesTurma.parse.mockReturnValue(parsedQuery);
      RefeicaoTurmaRepository.listarRefeicoesTurma.mockImplementation(() => {
        throw { code: 404 };
      });

      await expect(RefeicaoTurmaService.listarRefeicoesTurma(queryParams)).rejects.toEqual({ code: 404 });
    });
    it("deve lançar erro se os parâmetros de consulta forem inválidos", async () => {
      const invalidQueryParams = { pagina: "invalida", limite: -5 }; 
    
      RefeicaoTurmaSchema.listarRefeicoesTurma.parse.mockImplementation(() => {
        throw new Error("Validação falhou");
      });
    
      await expect(RefeicaoTurmaService.listarRefeicoesTurma(invalidQueryParams)).rejects.toThrow("Validação falhou");
    
      expect(RefeicaoTurmaSchema.listarRefeicoesTurma.parse).toHaveBeenCalledWith(invalidQueryParams);
      expect(RefeicaoTurmaRepository.listarRefeicoesTurma).not.toHaveBeenCalled();
    });
    it("deve lidar com queryParams vazio ou undefined", async () => {
      const queryParams = undefined;
      const parsedQuery = {}; 
    
      const mockResponse = {
        data: [{ _id: "1", descricao: "Refeição Teste", turma: { _id: "60f6a5d5e6c2f9d4a4c1a1e2" } }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
    
      RefeicaoTurmaSchema.listarRefeicoesTurma.parse.mockReturnValue(parsedQuery);
      RefeicaoTurmaRepository.listarRefeicoesTurma.mockResolvedValue(mockResponse);
    
      const result = await RefeicaoTurmaService.listarRefeicoesTurma(queryParams);
    
      expect(RefeicaoTurmaSchema.listarRefeicoesTurma.parse).toHaveBeenCalledWith({});
      expect(RefeicaoTurmaRepository.listarRefeicoesTurma).toHaveBeenCalledWith(parsedQuery);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("listarRefeicaoTurmaPorId", () => {
    it("deve retornar uma refeição se o ID for válido", async () => {
      const idParams = { id: "60f6a5d5e6c2f9d4a4c1a1e2" };
      const refeicaoMock = {
        _id: "60f6a5d5e6c2f9d4a4c1a1e2",
        descricao: "Feijão",
        turma: { _id: "1", descricao: "Turma A" },
      };

      RefeicaoTurmaSchema.buscarRefeicaoPorId.parse.mockReturnValue(idParams);
      RefeicaoTurmaRepository.listarRefeicaoTurmaPorId.mockResolvedValue(refeicaoMock);

      const result = await RefeicaoTurmaService.listarRefeicaoTurmaPorId(idParams);

      expect(RefeicaoTurmaSchema.buscarRefeicaoPorId.parse).toHaveBeenCalledWith(idParams);
      expect(RefeicaoTurmaRepository.listarRefeicaoTurmaPorId).toHaveBeenCalledWith(idParams.id);
      expect(result).toEqual(refeicaoMock);
    });

    it("deve lançar erro se o ID for inexistente", async () => {
      const idParams = { id: "60f6a5d5e6c2f9d4a4c1a1e2" };

      RefeicaoTurmaSchema.buscarRefeicaoPorId.parse.mockReturnValue(idParams);
      RefeicaoTurmaRepository.listarRefeicaoTurmaPorId.mockImplementation(() => {
        throw { message: "Id inexistente", code: 404 };
      });

      await expect(RefeicaoTurmaService.listarRefeicaoTurmaPorId(idParams)).rejects.toEqual({
        message: "Id inexistente",
        code: 404,
      });
    });
  });
  describe("criarRefeicaoTurma", () => {
    it("deve criar uma refeição de turma com sucesso", async () => {
      const data = {
        turma: "60f6a5d5e6c2f9d4a4c1a1e2",
        data_liberado: "2024-04-16",
        descricao: "Refeição Especial"
      };

      RefeicaoTurmaSchema.criarRefeicaoTurma.parse.mockReturnValue(data);
      const mockResult = { ...data, _id: "mocked_id" };
      RefeicaoTurmaRepository.criarRefeicaoTurma.mockResolvedValue(mockResult);

      const result = await RefeicaoTurmaService.criarRefeicaoTurma(data);

      expect(RefeicaoTurmaSchema.criarRefeicaoTurma.parse).toHaveBeenCalledWith(data);
      expect(RefeicaoTurmaRepository.criarRefeicaoTurma).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockResult);
    });
  });

  describe("atualizarRefeicaoTurma", () => {
    it("deve atualizar uma refeição com sucesso", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";
      const data = {
        descricao: "Atualizado",
        data_liberado: "2025-04-16"
      };

      RefeicaoTurmaSchema.buscarRefeicaoPorId.parse.mockReturnValue({ id });
      RefeicaoTurmaSchema.atualizarRefeicaoTurma.parse.mockReturnValue(data);

      const mockAtualizada = { _id: id, ...data };
      RefeicaoTurmaRepository.atualizarRefeicaoTurma.mockResolvedValue(mockAtualizada);

      const result = await RefeicaoTurmaService.atualizarRefeicaoTurma(id, data);

      expect(RefeicaoTurmaSchema.buscarRefeicaoPorId.parse).toHaveBeenCalledWith(id);
      expect(RefeicaoTurmaSchema.atualizarRefeicaoTurma.parse).toHaveBeenCalledWith(data);
      expect(RefeicaoTurmaRepository.atualizarRefeicaoTurma).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(mockAtualizada);
    });
  });

  describe("deletarRefeicaoTurma", () => {
    it("deve deletar uma refeição com sucesso", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";

      RefeicaoTurmaSchema.buscarRefeicaoPorId.parse.mockReturnValue({ id });

      const mockDeletada = { _id: id, descricao: "Refeição Deletada" };
      RefeicaoTurmaRepository.deletarRefeicaoTurma.mockResolvedValue(mockDeletada);

      const result = await RefeicaoTurmaService.deletarRefeicaoTurma(id);

      expect(RefeicaoTurmaSchema.buscarRefeicaoPorId.parse).toHaveBeenCalledWith(id);
      expect(RefeicaoTurmaRepository.deletarRefeicaoTurma).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockDeletada);
    });
  });
});

