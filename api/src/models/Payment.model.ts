import mongoose,{ Schema, Document }  from 'mongoose';

interface IPayment extends Document{
  appointmentId: string;
  paymentMethod?: string;
  paymentType?: string;
  DoctorFee?: number;
  bookingFee?: number;
  vat?: number;
  totalAmount?: number;
  createdAt?: Date; 
    updatedAt?: Date; 
}

const paymentSchema = new Schema({
  // appointmentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  appointmentId: { type: String, ref: 'Appointment', required: true },
  paymentMethod: { type: String, required: true },
  paymentType: { type: String, required: true },
  DoctorFee: { type: Number, required: true },
  bookingFee: { type: Number, required: true },
  vat: { type: Number },
  totalAmount: { type: Number, required: true }
}, { timestamps: true });
const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
