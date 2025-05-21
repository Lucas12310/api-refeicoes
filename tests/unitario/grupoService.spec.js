import { expect, describe, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../src/repository/GrupoRepository.js', () => ({
  default: {
    listarGrupos: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/schemas/grupoSchema.js', () => ({
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

const GrupoService = (await import('../../src/services/GrupoService.js')).default;
const GrupoRepository = (await import('../../src/repository/GrupoRepository.js')).default;
const GrupoSchema = (await import('../../src/schemas/grupoSchema.js')).default;

describe("GrupoService", () => {
  describe("listarGrupos", () => {
    it("deve retornar os grupos paginados corretamente", async () => {
      const queryParams = { pagina: 1, limite: 5, nome: "Grupo A" };
      const queryParsed = { ...queryParams };

      const mockResponse = {
        data: [{ _id: "1", nome: "Grupo A" }],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      };

      GrupoSchema.listar.parse.mockReturnValue(queryParsed);
      GrupoRepository.listarGrupos.mockResolvedValue(mockResponse);

      const result = await GrupoService.listarGrupos(queryParams);

      expect(GrupoSchema.listar.parse).toHaveBeenCalledWith(queryParams);
      expect(GrupoRepository.listarGrupos).toHaveBeenCalledWith(queryParsed);
      expect(result).toEqual(mockResponse);
    });

    it("deve lançar erro 404 se nenhum grupo for encontrado", async () => {
      const queryParams = { pagina: 1, limite: 5 };
      const queryParsed = { ...queryParams };

      GrupoSchema.listar.parse.mockReturnValue(queryParsed);
      GrupoRepository.listarGrupos.mockResolvedValue({ data: [] });

      await expect(GrupoService.listarGrupos(queryParams)).rejects.toEqual({
        code: 404,
      });
    });
  });

  describe("criar", () => {
    it("deve criar um novo grupo com sucesso", async () => {
      const dadosGrupo = { nome: "Grupo Teste" };
      const grupoCriado = { _id: "1", ...dadosGrupo };

      GrupoSchema.criar.parse.mockReturnValue(dadosGrupo);
      GrupoRepository.criar.mockResolvedValue(grupoCriado);

      const result = await GrupoService.criar(dadosGrupo);

      expect(GrupoSchema.criar.parse).toHaveBeenCalledWith(dadosGrupo);
      expect(GrupoRepository.criar).toHaveBeenCalledWith(dadosGrupo);
      expect(result).toEqual(grupoCriado);
    });
  });

  describe("atualizar", () => {
    it("deve atualizar um grupo com sucesso", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";
      const dadosAtualizados = { nome: "Grupo Atualizado" };

      const grupoAtualizado = { _id: id, ...dadosAtualizados };

      GrupoSchema.atualizar.parse.mockReturnValue({ id, ...dadosAtualizados });
      GrupoRepository.atualizar.mockResolvedValue(grupoAtualizado);

      const result = await GrupoService.atualizar(id, dadosAtualizados);

      expect(GrupoSchema.atualizar.parse).toHaveBeenCalledWith({ id, ...dadosAtualizados });
      expect(GrupoRepository.atualizar).toHaveBeenCalledWith({ id, ...dadosAtualizados });
      expect(result).toEqual(grupoAtualizado);
    });

    it("deve lançar erro 404 se o grupo não for encontrado", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";
      const dadosAtualizados = { nome: "Grupo Atualizado" };

      GrupoSchema.atualizar.parse.mockReturnValue({ id, ...dadosAtualizados });
      GrupoRepository.atualizar.mockRejectedValue({ code: 404 });

      await expect(GrupoService.atualizar(id, dadosAtualizados)).rejects.toEqual({ code: 404 });
    });
  });

  describe("deletar", () => {
    it("deve deletar um grupo com sucesso", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";

      GrupoSchema.deletar.parse.mockReturnValue(id);
      GrupoRepository.deletar.mockResolvedValue();

      await GrupoService.deletar(id);

      expect(GrupoSchema.deletar.parse).toHaveBeenCalledWith(id);
      expect(GrupoRepository.deletar).toHaveBeenCalledWith(id);
    });

    it("deve lançar erro 404 se o grupo não for encontrado", async () => {
      const id = "60f6a5d5e6c2f9d4a4c1a1e2";

      GrupoSchema.deletar.parse.mockReturnValue(id);
      GrupoRepository.deletar.mockRejectedValue({ code: 404 });

      await expect(GrupoService.deletar(id)).rejects.toEqual({ code: 404 });
    });
  });
});
