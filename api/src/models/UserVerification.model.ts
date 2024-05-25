import mongoose, {Schema, Document}  from 'mongoose';

interface IVerification extends Document{
  id:string;
  userId:string;
  uniqueString?:string;
  expiresAt?:Date;
}

const userVerificationSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  uniqueString: { type: String },
  expiresAt: { type: Date }
}, { timestamps: true });

const Verification =mongoose.model<IVerification>('UserVerification', userVerificationSchema);

export default Verification;
