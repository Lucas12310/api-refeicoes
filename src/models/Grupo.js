import mongoose from 'mongoose';
import { ObjectId } from "mongodb";

const roleSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId, auto: true },
    nome: { type: String, required: true }, // Exemplo: 'admin', 'funcionario'...
  },
  { versionKey: false }
);

export default mongoose.model('grupo', roleSchema);