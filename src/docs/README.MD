## Como inserir uma nova rota na documentação

- Você irá mexer apenas nas pastas de "routes, config/head.js e schemas" para adicionar a sua rota
- Mude os nomes das variáveis para indentificar melhor sua rotas.

Na parte:
```javascript
    EstagioFiltro: {
    title: "EstagioFiltro", 
    type: "object",
    properties: {
      _id: { type: "string" },
      matricula: { type: "string" },
      nome: { type: "string" },
      ativo: { type: "boolean" },
      turma: { type: "string" },
    },
  },
  EstagioListagemPaginada: {
    title: "EstagioListagemPaginada",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/EstagioListagem" }
      },
      total: { type: "integer", example: 100 },
      limit: { type: "integer", example: 10 },
      totalPages: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 }
    },
    description: "Schema para listagem paginada de estagios."
  },
```
Define quais os campos que irão aparecerão no schema, e nos parametros do seu get, na documentação, mude-os de acordo com os parametros que a sua rota exige.

O _id é removido do get geral na parte do código:
```javascript
const filteredEstagiosFiltro = {
  ...estagioSchemas.EstagioFiltro,
  properties: Object.fromEntries(
    Object.entries(estagioSchemas.EstagioFiltro.properties).filter(([key]) => key !== "_id")
  )
};
```

- Quaisquer dúvida leia os comentários deixados ao longo dos código ou pergunte para o @Thalysson Emanoel