import mongoose from "mongoose";

const CursoSchema =  new mongoose.Schema({
    nome: {type: String, required: [true, "O nome do curso é obrigatório!"] },
    contra_turnos: {type: {
        segunda: {type: Boolean, required: true, default: false},
        terca: {type: Boolean, required: true, default: false},
        quarta: {type: Boolean, required: true, default: false},
        quinta: {type: Boolean, required: true, default: false},
        sexta: {type: Boolean, required: true, default: false},
        sabado: {type: Boolean, required: true, default: false},
        domingo: {type: Boolean, required: true, default: false},
      }, required: [true, "Os contra-turnos são obrigatórios!"], _id: false
    },
    codigo_suap: {type: String, required: [true, "O codigo do curso é obrigatório!"] },
}, {versionKey: false})

const Curso = mongoose.model("cursos", CursoSchema);

export default Curso;