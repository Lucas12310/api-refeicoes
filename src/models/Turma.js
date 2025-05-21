import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const TurmaSchema = new mongoose.Schema({
  _id: { type: ObjectId, auto: true },
  codigo_suap: { type: String, required: [true, "Um código do SUAP é obrigatório!"] },
  descricao: { type: String, required: [true, "Uma descrição é obrigatório!"] },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cursos",
    required: [true, "Um id de curso é obrigatório!"]
  }
}, { versionKey: false });

TurmaSchema.plugin(mongoosePaginate);

const Turma = mongoose.model("turmas", TurmaSchema);

export default Turma;