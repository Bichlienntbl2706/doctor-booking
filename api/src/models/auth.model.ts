import mongoose, {Schema, Document}  from 'mongoose';

const userRoleEnum = ['admin', 'patient', 'doctor'];

export interface IAuth extends Document{
  id: string;
  email?: string;
  password?: string;
  userId: string;
  role?: string;
}
const authSchema = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: String },
  role: { type: String, enum: userRoleEnum, required: true }
}, { timestamps: true });
const Auth = mongoose.model<IAuth>('Auth', authSchema);
export  {Auth};