import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const UsuarioSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    nome: { type: String, required: [true, "O nome é obrigatório!"] },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "O email é obrigatório!"],
      validate: {
        validator: function (email) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
        },
        message: "Email inválido!",
      },
    },
    senha: {
      type: String,
      required: [true, "A senha é obrigatória!"],
    },
    ativo: { type: Boolean, required: true, default: false },
    grupo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "grupo",
      required: true,
    },
    refreshToken: { type: String },
    accessToken: { type: String },
  },
  { versionKey: false }
);

UsuarioSchema.plugin(mongoosePaginate);

const Usuario = mongoose.model("usuarios", UsuarioSchema);

export default Usuario;
