import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import mongoosePaginate from "mongoose-paginate-v2";

const RefeicoesTurmaSchema = new mongoose.Schema({
  _id: { type: ObjectId, auto: true, required: [true, "O id não é válido"] },
  turma: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "turmas",
    required: [true, "A turma é obrigatória!"]
  },
  data_liberado: { type: Date, required: [true, "Uma data é obrigatório!"] },
  descricao: { type: String }// Descrição opcional
}, { versionKey: false })

RefeicoesTurmaSchema.plugin(mongoosePaginate);

const RefeicaoTurma = mongoose.model("refeicoesTurmas", RefeicoesTurmaSchema);

export default RefeicaoTurma;