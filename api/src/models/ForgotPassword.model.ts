import mongoose, {Schema, Document}  from 'mongoose';

interface IForgotPassword extends Document{
  id: string;
  userId: string;
  uniqueString?: string;
  expiresAt?: Date;
}

const forgotPasswordSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  uniqueString: { type: String },
  expiresAt: { type: Date }
}, { timestamps: true });

const ForgotPassword = mongoose.model<IForgotPassword>('ForgotPassword', forgotPasswordSchema);

export default ForgotPassword;
