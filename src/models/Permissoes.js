import mongoose from 'mongoose';
import { ObjectId } from "mongodb";

const permissoesSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId, auto: true },
    metodos: { type: [String], required: true }, // Exemplo: ['GET', 'POST', 'PATCH', 'DELETE']
    grupo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'grupo', required: true },
    rota_id: { type: mongoose.Schema.Types.ObjectId, ref: 'rota', required: true },
  },
  { versionKey: false }
);

export default mongoose.model('permissoes', permissoesSchema);