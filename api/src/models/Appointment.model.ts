import mongoose, {Schema, Document, Types}  from 'mongoose';
const userPrescriptionEnum = ['issued', 'notIssued'];
const userPayEnum = ['paid', 'unpaid'];

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  paymentId: Types.ObjectId;
  prescriptionId?: Types.ObjectId;
  trackingId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  reasonForVisit?: string;
  status?: string;
  paymentStatus?: string;
  prescriptionStatus?: string;
  isFollowUp?: boolean;
  patientType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const appointmentSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, 
  prescriptionId: { type: Schema.Types.ObjectId, ref: 'Prescription' },
  trackingId: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  description: { type: String },
  scheduleDate: { type: String },
  scheduleTime: { type: String },
  reasonForVisit: { type: String },
  status: { type: String, default: 'pending' },
  paymentStatus: { type: String,enum: userPayEnum ,default: 'unpaid' },
  prescriptionStatus: { type: String,enum: userPrescriptionEnum,  default: 'notIssued' },
  isFollowUp: { type: Boolean, default: false },
  patientType: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;