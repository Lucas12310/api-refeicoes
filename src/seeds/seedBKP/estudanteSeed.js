import { faker } from "@faker-js/faker";
import Estudante from "../models/Estudante.js";
import Turma from "../models/Turma.js";
import Curso from "../models/Curso.js";
import fs from "fs";

export default async function estudanteSeed() {
  const turmas = await Turma.find({});
  const cursos = await Curso.find({});
  await Estudante.deleteMany({});

  let exemploEstudante = null;

  for (let i = 0; i < 100; i++) {
    const randomTurma = Math.floor(Math.random() * turmas.length);
    const randomCurso = cursos[getRandomInt(cursos.length)];
    const turma = turmas[randomTurma];
    const curso = cursos[randomCurso];
    const matriculaEstudante = faker.string.numeric(13);
    const nomeEstudante = faker.person.fullName();
    const estudante = {
      matricula: matriculaEstudante,
      nome: nomeEstudante,
      turma: turma._id,
      curso: curso._id,
      ativo: true,
    };

    const estudanteCriado = await Estudante.create(estudante);

    // Salvar o primeiro estudante como exemplo
    if (i === 0) {
      exemploEstudante = await Estudante.findById(estudanteCriado._id)
        .populate({
          path: "turma",
          populate: {
            path: "curso",
          },
        })
        .lean(); // Converte para um objeto simples -> É basicamente um JSON
      console.log("Exemplo estudante:", exemploEstudante);
    }
  }

  // Salvar o exemplo em um arquivo JSON para reutilização pelo Swagger
  if (exemploEstudante) {
    fs.writeFileSync(
      "./src/docs/examplesSchemas/estudanteExemplo.json",
      JSON.stringify(exemploEstudante, null, 2)
    );
  }

  console.log("Estudantes gerados com sucesso");
}