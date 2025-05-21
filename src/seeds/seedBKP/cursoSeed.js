import Curso from "../models/Curso.js";

export default async function cursoSeed() {
  //Serão adicionados 3 cursos, info, edif e eletro

  const infoMock = {
    nome: "Informática",
    contra_turnos: {
      segunda: false,
      terca: false,
      quarta: true,
      quinta: false,
      sexta: false,
      sabado: false,
      domingo: false,
    },
    codigo: "0303"
  };
  const edifMock = {
    nome: "Edificações",
    contra_turnos: {
      segunda: false,
      terca: true,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
      domingo: false,
    },
    codigo: "0301"
  };
  const eletroMock = {
    nome: "Eletromecânica",
    contra_turnos: {
      segunda: true,
      terca: false,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
      domingo: false,
    },
    codigo: "0302"
  };

  const adsMock = {
    nome: "ADS",
    contra_turnos: {
      segunda: true,
      terca: false,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
      domingo: false,
    },
    codigo: "0314"
  };

  await Curso.deleteMany({});

  await Curso.create(infoMock);

  await Curso.create(edifMock);

  await Curso.create(eletroMock);

  await Curso.create(adsMock);

  console.log("Cursos adicionados com sucesso!");
}
