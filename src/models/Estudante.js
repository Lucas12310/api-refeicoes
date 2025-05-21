import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const EstudanteSchema = new mongoose.Schema({
  _id: { type: ObjectId, auto: true },
  matricula: { type: String, required: true },
  nome: { type: String, required: true },
  turma: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "turmas",
    required: true
  },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cursos",
    required: true
  },
  ativo: {
    type: Boolean, required: true, default: true
  }
}, { versionKey: false })

EstudanteSchema.plugin(mongoosePaginate)

const Estudante = mongoose.model("estudantes", EstudanteSchema);

export default Estudante;