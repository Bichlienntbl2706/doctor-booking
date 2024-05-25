import mongoose, {Schema, Document, Types}  from 'mongoose';

interface IAppointment extends Document{
    id: string;
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
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
    id: { type: String, required: true },
    patientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
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
    paymentStatus: { type: String, default: 'unpaid' },
    prescriptionStatus: { type: String, default: 'notIssued' },
    isFollowUp: { type: Boolean, default: false },
    patientType: { type: String }
  }, { timestamps: true });
  
  const Appointment = mongoose.model<IAppointment>('Appointment',appointmentSchema );
export default Appointment;
  