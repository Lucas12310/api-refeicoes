import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Refeições Back End',
      description: 'Esse é o back end para o sistema de refeições do IFRO - Campus Vilhena<br>Para todas as além da <a href="#operations-tag-usuarios">usuarios/entrar</a> é necessário estar autenticado e enviar o token JWT no header Authorization',
      version: '1.0.0',
    },
    components:{
      securitySchemes:{
        bearerAuth: {
          type:"http",
          scheme: "bearer",
          bearerFormat:"JWT"
        }
      }
    },
    security:[{
      bearerAuth:[]
    }],
    tags: [
      {
        name: "cursos", description: "Cursos Técnicos"
      },
      {
        name: "turmas", description: "Turmas"
      },
      {
        name: "estudantes", description: "Estudantes"
      },
      {
        name: "projetos", description: "Projetos"
      },
      {
        name: "estagios", description: "Estágios"
      },
      {
        name: "refeicoesTurmas", description: "Refeições por Turma"
      },
      {
        name: "usuarios", description: "Usuários"
      },
      {
        name: "refeicoes", description: "Refeições"
      }
    ],
  },
  apis: ['./src/routes/*.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
