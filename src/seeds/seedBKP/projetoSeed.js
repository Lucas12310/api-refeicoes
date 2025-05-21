import Projeto from "../models/Projeto.js";
import Estudante from "../models/Estudante.js";
import { faker } from "@faker-js/faker";

export default async function projetoSeed() {
  //Serão adicionados 10 projetos com 5 estudantes cada
  const estudantes = await Estudante.find({}).limit(50);

  await Projeto.deleteMany({});

  for (let i = 0; i < 10; i++) {
    const estudantesProjeto = estudantes.slice(i * 5, (i + 1) * 5);
    const projeto = {
      nome: `Projeto ${faker.hacker.noun()}`,
      data_inicio: faker.date.recent(),
      data_termino: faker.date.future(),
      estudantes: estudantesProjeto.map((estudante) => estudante._id),
      turnos: {
        segunda: faker.datatype.boolean(),
        terca: faker.datatype.boolean(),
        quarta: faker.datatype.boolean(),
        quinta: faker.datatype.boolean(),
        sexta: faker.datatype.boolean(),
        sabado: faker.datatype.boolean(),
        domingo: faker.datatype.boolean(),
      },
      status: "Em andamento"
    };
    await Projeto.create(projeto);
  }

  console.log("Projetos adicionados com sucesso!");
}