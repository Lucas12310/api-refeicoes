import mongoose from 'mongoose';
import { ObjectId } from "mongodb";

const passwordResetCodeSchema = new mongoose.Schema({
    _id: { type: ObjectId, auto: true },
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
});

const PasswordResetCode = mongoose.model('PasswordResetCode', passwordResetCodeSchema);

export default PasswordResetCode;
