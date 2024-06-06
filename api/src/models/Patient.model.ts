import mongoose ,{ Schema, Document } from 'mongoose';

export interface IPatient extends Document{
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
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
}

const patientSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String },
    mobile: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    gender: { type: String },
    country: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    img: { type: String }
  }, { timestamps: true });

  const Patient = mongoose.model<IPatient>('Patient', patientSchema)
 export default Patient;
  