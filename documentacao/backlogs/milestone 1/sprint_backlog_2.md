# data 01/04/25
# Back-end
- Será necessário adaptar a API na arquitetura de camadas (Controller, Service e Repository)

- Adicionar as camadas e validação zod para as rotas Estudantes, Estagios e RefeicoesTurmas (Thalysson):
    - **responseHandler.js:** Criar o middleware para capturar as repostas de sucesso e erros;
    - **estudanteRoutes.js:** Configurar o middleware na rota;
    - **estudantesController.js:** Remover as repostas de sucessos e erros do controller;
    - **estudantesService.js:** Criar o service de estudante;
    - **estudantesRepository.js:** Criar o repository para estudante;

- Adicionar as camadas e validação zod para as rotas Usuarios e Refeicoes (Caio)
  
- Adicionar as camadas e validação zod para as rotas Cursos, Turmas e Projetos  (Lucas)

- foi discutido com os integrantes da equipe sugestões de melhoria e padrão de codigo que será utilizado