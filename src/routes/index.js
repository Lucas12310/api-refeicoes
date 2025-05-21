import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import getSwaggerOptions from "../docs/config/head.js";
import cursos from "./cursoRoutes.js";
import turmas from "./turmaRoutes.js";
import estudantes from "./estudanteRoutes.js";
import projetos from "./projetoRoutes.js";
import estagios from "./estagioRoutes.js";
import refeicaoTurmas from "./refeicaoTurmaRoutes.js";
import usuarios from "./usuarioRoutes.js";
import refeicao from "./refeicaoRoutes.js";
import auth from "./authRoutes.js";
import permissoes from "./permissoes.js";
import rota from "./rotaRoutes.js";
import grupo from "./grupoRoutes.js";

const routes = (app) => {
   // Configurando a documentação da Swagger UI para ser servida diretamente em '/'
   const swaggerDocs = swaggerJsDoc(getSwaggerOptions());
   app.use(swaggerUI.serve);
   app.get("/", (req, res, next) => {
     swaggerUI.setup(swaggerDocs)(req, res, next);
  });

  app.use(
    usuarios,
    cursos,
    turmas,
    estudantes,
    projetos,
    estagios,
    refeicaoTurmas,
    refeicao,
    permissoes,
    grupo,
    rota,
    auth
  );

  // Se não é nenhuma rota válida, produz 404
  app.use((req, res, next) => {
		res.sendStatus(404).json({ message: "Rote not found" });
	});

};

export default routes;
