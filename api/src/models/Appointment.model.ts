import mongoose, { Schema, Document, Types } from 'mongoose';

const userPrescriptionEnum = ['issued', 'notIssued'];
const userPayEnum = ['paid', 'unpaid'];

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  doctorId: {
    type: Types.ObjectId;
    ref: 'Doctor'; // Tham chiếu đến model Doctor
    firstName: string; // Thêm firstName vào đây nếu bạn lưu trữ trong doctorId
    lastName: string; // Thêm lastName vào đây nếu bạn lưu trữ trong doctorId
    specialization: string;
  };
  paymentId: {
    type: Types.ObjectId;
    ref: 'Payment';
    totalAmount: Number;
  }
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
  doctorName?: string;
  speciality?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const appointmentSchema: Schema = new Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', totalAmount: Number },
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
    trackingId: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    doctorName: { type: String },
    speciality: { type: String },
    address: { type: String },
    description: { type: String },
    scheduleDate: { type: String },
    scheduleTime: { type: String },
    reasonForVisit: { type: String },
    status: { type: String, default: 'pending' },
    paymentStatus: { type: String, enum: userPayEnum, default: 'unpaid' },
    prescriptionStatus: { type: String, enum: userPrescriptionEnum, default: 'notIssued' },
    isFollowUp: { type: Boolean, default: false },
    patientType: { type: String },
  },
  { timestamps: true }
);


const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
