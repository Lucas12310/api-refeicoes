import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const EstagioSchema = new mongoose.Schema({
  estudante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "estudantes",
    required: [true, "O estudante é obrigatório!"]
  },
  data_inicio: { type: Date, required: [true, "A data de inicio é obrigatório!"] },
  data_termino: { type: Date, required: [true, "A data de termino é obrigatório!"] },
  turnos: {
    segunda: { type: Boolean, required: true, default: false },
    terca: { type: Boolean, required: true, default: false },
    quarta: { type: Boolean, required: true, default: false },
    quinta: { type: Boolean, required: true, default: false },
    sexta: { type: Boolean, required: true, default: false },
    sabado: { type: Boolean, required: true, default: false },
    domingo: { type: Boolean, required: true, default: false },
  },
  descricao: { type: String },
  status: { type: String, enum: { values: ["Em andamento", "Encerrado", "Pausado"], message: "O valor tem quer ser 'Em andamento', 'Encerrado' ou 'Pausado'" } }
}, { versionKey: false })

EstagioSchema.plugin(mongoosePaginate);

const Estagio = mongoose.model("estagios", EstagioSchema);

export default Estagio; 