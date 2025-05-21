import { expect, describe, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../src/repository/PermissoesRepository.js', () => ({
  default: {
    listarPermissoes: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/schemas/permissoesSchemas.js', () => ({
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

const PermissoesService = (await import('../../src/services/PermissoesService.js')).default;
const PermissoesRepository = (await import('../../src/repository/PermissoesRepository.js')).default;
const PermissoesSchema = (await import('../../src/schemas/permissoesSchemas.js')).default;

describe("PermissoesService", () => {
  describe("listarPermissoes", () => {
    it("deve retornar as permissões paginadas corretamente", async () => {
      const queryParams = { pagina: 1, limite: 5, grupo: "Admin" };
      const queryParsed = { ...queryParams };

      const mockResponse = {
        data: [{ _id: "1", metodos: ["GET", "POST"] }],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      };

      PermissoesSchema.listar.parse.mockReturnValue(queryParsed);
      PermissoesRepository.listarPermissoes.mockResolvedValue(mockResponse);

      const result = await PermissoesService.listarPermissoes(queryParams);

      expect(PermissoesSchema.listar.parse).toHaveBeenCalledWith(queryParams);
      expect(PermissoesRepository.listarPermissoes).toHaveBeenCalledWith(queryParsed);
      expect(result).toEqual(mockResponse);
    });

    it("deve lançar erro 404 se nenhuma permissão for encontrada", async () => {
      const queryParams = { pagina: 1, limite: 5 };

      PermissoesSchema.listar.parse.mockReturnValue(queryParams);
      PermissoesRepository.listarPermissoes.mockResolvedValue({ data: [] });

      await expect(PermissoesService.listarPermissoes(queryParams)).rejects.toEqual({ code: 404 });
    });
  });

  describe("criar", () => {
    it("deve criar uma nova permissão com sucesso", async () => {
      const dadosPermissao = {
        metodos: ["GET", "POST"],
        grupo_id: "123",
        rota_id: "456",
      };

      const permissaoCriada = { _id: "1", ...dadosPermissao };

      PermissoesSchema.criar.parse.mockReturnValue(dadosPermissao);
      PermissoesRepository.criar.mockResolvedValue(permissaoCriada);

      const result = await PermissoesService.criar(dadosPermissao);

      expect(PermissoesSchema.criar.parse).toHaveBeenCalledWith(dadosPermissao);
      expect(PermissoesRepository.criar).toHaveBeenCalledWith(dadosPermissao);
      expect(result).toEqual(permissaoCriada);
    });
  });

  describe("atualizar", () => {
    it("deve atualizar uma permissão com sucesso", async () => {
      const id = "1";
      const dadosAtualizados = { metodos: ["PATCH"] };

      const permissaoAtualizada = { _id: id, ...dadosAtualizados };

      PermissoesSchema.atualizar.parse.mockReturnValue({ id, ...dadosAtualizados });
      PermissoesRepository.atualizar.mockResolvedValue(permissaoAtualizada);

      const result = await PermissoesService.atualizar(id, dadosAtualizados);

      expect(PermissoesSchema.atualizar.parse).toHaveBeenCalledWith({ id, ...dadosAtualizados });
      expect(PermissoesRepository.atualizar).toHaveBeenCalledWith({ id, ...dadosAtualizados });
      expect(result).toEqual(permissaoAtualizada);
    });

    it("deve lançar erro 404 se a permissão não for encontrada", async () => {
      const id = "1";
      const dadosAtualizados = { metodos: ["PATCH"] };

      PermissoesSchema.atualizar.parse.mockReturnValue({ id, ...dadosAtualizados });
      PermissoesRepository.atualizar.mockRejectedValue({ code: 404 });

      await expect(PermissoesService.atualizar(id, dadosAtualizados)).rejects.toEqual({ code: 404 });
    });
  });

  describe("deletar", () => {
    it("deve deletar uma permissão com sucesso", async () => {
      const id = "1";

      PermissoesSchema.deletar.parse.mockReturnValue(id);
      PermissoesRepository.deletar.mockResolvedValue();

      await PermissoesService.deletar(id);

      expect(PermissoesSchema.deletar.parse).toHaveBeenCalledWith(id);
      expect(PermissoesRepository.deletar).toHaveBeenCalledWith(id);
    });

    it("deve lançar erro 404 se a permissão não for encontrada", async () => {
      const id = "1";

      PermissoesSchema.deletar.parse.mockReturnValue(id);
      PermissoesRepository.deletar.mockRejectedValue({ code: 404 });

      await expect(PermissoesService.deletar(id)).rejects.toEqual({ code: 404 });
    });
  });
});
