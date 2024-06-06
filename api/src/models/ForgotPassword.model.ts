import mongoose, {Schema, Document}  from 'mongoose';

interface IForgotPassword extends Document{
  userId: string;
  uniqueString?: string;
  expiresAt?: Date;
}

const forgotPasswordSchema = new Schema({
  userId: { type: String, required: true },
  uniqueString: { type: String },
  expiresAt: { type: Date }
}, { timestamps: true });

const ForgotPassword = mongoose.model<IForgotPassword>('ForgotPassword', forgotPasswordSchema);

export default ForgotPassword;
