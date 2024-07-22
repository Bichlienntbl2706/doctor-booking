import mongoose ,{ Schema, Document } from 'mongoose';

export interface IPatient extends Document{
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    weight?: string;
    bloodGroup?: string;
    mobile?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    gender?: string;
    country?: string;
    email?: string;
    address?: string;
    img?: string;
    createdAt?: Date; 
    updatedAt?: Date; 
    isBlocked?: Boolean;
}

const patientSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    weight: { type: String },
    bloodGroup: { type: String },
    mobile: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    gender: { type: String },
    country: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    img: { type: String },
    isBlocked: {
        type: Boolean,
        default: false,
    },
  }, { timestamps: true });

  const Patient = mongoose.model<IPatient>('Patient', patientSchema)
 export default Patient;
  