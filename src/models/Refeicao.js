import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const EstudanteSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    nome: {type: String, required: true},
    matricula: {type: String, required: true},
    curso: {type: String, required: true},
    turma: {type: String, required: true}
})

const UsuarioSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    nome: {type: String, required: true},
    email: {type: String, required: true},
})

const RefeicaoSchema = new mongoose.Schema({
    estudante: {
        type: EstudanteSchema,
        ref: "estudantes",
        required: true
    },
    data: { type: Date, required: true},
    tipoRefeicao: { type: String, required: true},
    usuarioRegistrou: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"usuarios",
      required: true
  },
}, {versionKey: false});

RefeicaoSchema.plugin(mongoosePaginate);

const Refeicao = mongoose.model("refeicoes", RefeicaoSchema);

export default Refeicao;