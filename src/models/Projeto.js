import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProjetoSchema = new mongoose.Schema({
    nome: { type: String, required: [true, "O nome do projeto é obrigatório!"] },
    estudantes: [{
        type: mongoose.Schema.Types.String,
        ref: "estudantes"
    }],
    data_inicio: { type: Date, required: [true, "A data de inicio é obrigatório!"]},
    data_termino: { type: Date, required: [true, "A data de termino é obrigatório!"]},
    turnos: {
        segunda: {type: Boolean, required: true, default: false},
        terca: {type: Boolean, required: true, default: false},
        quarta: {type: Boolean, required: true, default: false},
        quinta: {type: Boolean, required: true, default: false},
        sexta: {type: Boolean, required: true, default: false},
        sabado: {type: Boolean, required: true, default: false},
        domingo: {type: Boolean, required: true, default: false},
    },
    status: {type: String, enum: {values: ["Em andamento", "Encerrado", "Pausado"], message: "O valor tem quer ser 'Em andamento', 'Encerrado' ou 'Pausado'"}}
}, {versionKey: false})

ProjetoSchema.plugin(mongoosePaginate);

const Projeto = mongoose.model("projetos", ProjetoSchema);

export default Projeto;