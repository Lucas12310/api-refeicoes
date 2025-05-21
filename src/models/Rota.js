import mongoose from 'mongoose';
import { ObjectId } from "mongodb";

const rotaSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId, auto: true },
    nome: { type: String, required: true }, // Exemplo: 'estudantes', 'turmas', 'curso'...
    rota: { type: [String], required: true }, // Exemplo: '/estudantes', 'estudantes:id', '/turmas', '/curso'...-> endpoints específicos
  },
  { versionKey: false }
);

export default mongoose.model('rota', rotaSchema);