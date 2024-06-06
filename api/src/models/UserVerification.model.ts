import mongoose, {Schema, Document}  from 'mongoose';

interface IVerification extends Document{
  userId:string;
  uniqueString?:string;
  expiresAt?:Date;
}

const userVerificationSchema = new Schema({
  userId: { type: String, required: true },
  uniqueString: { type: String },
  expiresAt: { type: Date }
}, { timestamps: true });

const Verification =mongoose.model<IVerification>('UserVerification', userVerificationSchema);

export default Verification;
