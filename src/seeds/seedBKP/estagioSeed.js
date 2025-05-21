import Estagio from "../models/Estagio.js";
import Estudante from "../models/Estudante.js";
import { faker } from "@faker-js/faker";

export default async function estagioSeed() {
  //Serão adicionados 5 estágios

  const estudantes = await Estudante.find({}).limit(5);

  await Estagio.deleteMany({});

  for(let i = 0; i < 5; i++){
    const estudante = estudantes[i];
    const estagio = {
      descricao: "Estágio na CGTI do IFRO campus Vilhena",
      data_inicio: faker.date.recent(),
      data_termino: faker.date.future(),
      estudante: estudante._id,
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
    }
    await Estagio.create(estagio);
  }

  console.log("Estágios adicionados com sucesso!");
}