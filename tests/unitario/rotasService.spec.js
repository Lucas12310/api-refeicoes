import { expect, describe, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../src/repository/RotaRepository.js', () => ({
  default: {
    listarRotas: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/schemas/rotaSchema.js', () => ({
  default: {
    listar: {
      parse: jest.fn(),
    },
    criar: {
      parse: jest.fn(),
    },
    atualizar: {
      parse: jest.fn(),
    },
    deletar: {
      parse: jest.fn(),
    },
  },
}));

const RotaService = (await import('../../src/services/RotaService.js')).default;
const RotaRepository = (await import('../../src/repository/RotaRepository.js')).default;
const RotaSchema = (await import('../../src/schemas/rotaSchema.js')).default;

describe("RotaService", () => {
  describe("listarRotas", () => {
    it("deve retornar as rotas paginadas corretamente", async () => {
      const queryParams = { pagina: 1, limite: 5, nome: "Rota A" };
      const queryParsed = { ...queryParams };

      const mockResponse = {
        data: [{ _id: "1", nome: "Rota A", rota: ["/home"] }],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      };

      RotaSchema.listar.parse.mockReturnValue(queryParsed);
      RotaRepository.listarRotas.mockResolvedValue(mockResponse);

      const result = await RotaService.listarRotas(queryParams);

      expect(RotaSchema.listar.parse).toHaveBeenCalledWith(queryParams);
      expect(RotaRepository.listarRotas).toHaveBeenCalledWith(queryParsed);
      expect(result).toEqual(mockResponse);
    });

    it("deve lançar erro 404 se nenhuma rota for encontrada", async () => {
      const queryParams = { pagina: 1, limite: 5 };
      const queryParsed = { ...queryParams };

      RotaSchema.listar.parse.mockReturnValue(queryParsed);
      RotaRepository.listarRotas.mockResolvedValue({ data: [] });

      await expect(RotaService.listarRotas(queryParams)).rejects.toEqual({
        code: 404,
      });
    });
  });

  describe("criar", () => {
    it("deve criar uma nova rota com sucesso", async () => {
      const dadosRota = {
        nome: "Rota Teste",
        rota: ["/home", "/about"],
      };

      const rotaCriada = { _id: "1", ...dadosRota };

      RotaSchema.criar.parse.mockReturnValue(dadosRota);
      RotaRepository.criar.mockResolvedValue(rotaCriada);

      const result = await RotaService.criar(dadosRota);

      expect(RotaSchema.criar.parse).toHaveBeenCalledWith(dadosRota);
      expect(RotaRepository.criar).toHaveBeenCalledWith(dadosRota);
      expect(result).toEqual(rotaCriada);
    });
  });

  describe("atualizar", () => {
    it("deve atualizar uma rota com sucesso", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";
      const dadosAtualizados = { nome: "Rota Atualizada" };

      const rotaAtualizada = { _id: id, ...dadosAtualizados };

      RotaSchema.atualizar.parse.mockReturnValue({ id, ...dadosAtualizados });
      RotaRepository.atualizar.mockResolvedValue(rotaAtualizada);

      const result = await RotaService.atualizar(id, dadosAtualizados);

      expect(RotaSchema.atualizar.parse).toHaveBeenCalledWith({ id, ...dadosAtualizados });
      expect(RotaRepository.atualizar).toHaveBeenCalledWith({ id, ...dadosAtualizados });
      expect(result).toEqual(rotaAtualizada);
    });

    it("deve lançar erro 404 se a rota não for encontrada", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";
      const dadosAtualizados = { nome: "Rota Atualizada" };

      RotaSchema.atualizar.parse.mockReturnValue({ id, ...dadosAtualizados });
      RotaRepository.atualizar.mockRejectedValue({ code: 404 });

      await expect(RotaService.atualizar(id, dadosAtualizados)).rejects.toEqual({ code: 404 });
    });
  });

  describe("deletar", () => {
    it("deve deletar uma rota com sucesso", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";

      RotaSchema.deletar.parse.mockReturnValue(id);
      RotaRepository.deletar.mockResolvedValue();

      await RotaService.deletar(id);

      expect(RotaSchema.deletar.parse).toHaveBeenCalledWith(id);
      expect(RotaRepository.deletar).toHaveBeenCalledWith(id);
    });

    it("deve lançar erro 404 se a rota não for encontrada", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";

      RotaSchema.deletar.parse.mockReturnValue(id);
      RotaRepository.deletar.mockRejectedValue({ code: 404 });

      await expect(RotaService.deletar(id)).rejects.toEqual({ code: 404 });
    });
  });
});
