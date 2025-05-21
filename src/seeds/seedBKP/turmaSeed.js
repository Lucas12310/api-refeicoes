import Curso from "../models/Curso.js";
import Turma from "../models/Turma.js";

export default async function turmaSeed() {
  //Serão adicionadas 18 turmas, 6 de cada curso

  const turmaDescrioes = [
    "Informática 1A",
    "Informática 2A",
    "Informática 3A",
    "Informática 1B",
    "Informática 2B",
    "Informática 3B",
    "Edificações 1A",
    "Edificações 2A",
    "Edificações 3A",
    "Edificações 1B",
    "Edificações 2B",
    "Edificações 3B",
    "Eletromecânica 1A",
    "Eletromecânica 2A",
    "Eletromecânica 3A",
    "Eletromecânica 1B",
    "Eletromecânica 2B",
    "Eletromecânica 3B",
  ];

  const turmaCodigos = [
    "20241.1.0303.1M",
    "20241.2.0303.1M",
    "20241.3.0303.1M",
    "20241.1.0303.1D",
    "20241.2.0303.1D",
    "20241.3.0303.1D",
    "20241.1.0301.1M",
    "20241.2.0301.1M",
    "20241.3.0301.1M",
    "20241.1.0301.1D",
    "20241.2.0301.1D",
    "20241.3.0301.1D",
    "20241.1.0302.1M",
    "20241.2.0302.1M",
    "20241.3.0302.1M",
    "20241.1.0302.1D",
    "20241.2.0302.1D",
    "20241.3.0302.1D",
  ];

  const cursos = await Curso.find({});
  const info = cursos.find((curso) => curso.nome === "Informática");
  const edif = cursos.find((curso) => curso.nome === "Edificações");
  const eletro = cursos.find((curso) => curso.nome === "Eletromecânica");

  await Turma.deleteMany({});

  for (let i = 0; i < turmaDescrioes.length; i++) {
    const descricao = turmaDescrioes[i];

    if (descricao.includes("Informática")) {
      await Turma.create({codigo_suap: turmaCodigos[i] ,descricao, curso: info._id });
    } else if (descricao.includes("Edificações")) {
      await Turma.create({codigo_suap: turmaCodigos[i] ,descricao, curso: edif._id });
    } else {
      await Turma.create({codigo_suap: turmaCodigos[i] ,descricao, curso: eletro._id });
    }
  }

  console.log("Turmas adicionadas com sucesso!");
}
