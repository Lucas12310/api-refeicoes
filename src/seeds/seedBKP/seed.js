import "dotenv/config";
import cursoSeed from './cursoSeed.js';
import turmaSeed from './turmaSeed.js';
import usuarioSeed from './usuarioSeed.js';
import estudanteSeed from './estudanteSeed.js';
import estagioSeed from './estagioSeed.js';
import projetoSeed from './projetoSeed.js';
import { conectarBanco } from "../config/dbConnect.js";

async function seed() {
  await conectarBanco();
  await cursoSeed();
  await turmaSeed();
  await estudanteSeed();
  await projetoSeed();
  await estagioSeed();
  await usuarioSeed();

  console.log("Seed finalizado com sucesso!");
  process.exit();
}

seed();