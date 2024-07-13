import mongoose, { Schema, Document } from "mongoose";

const genderEnum = ["male", "female"];

export interface IDoctor extends Document {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  img?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  biography?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicImages?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  price?: string;
  services?: string;
  specialization?: string;
  degree?: string;
  college?: string;
  completionYear?: string;
  experience?: string;
  designation?: string;
  award?: string;
  awardYear?: string;
  registration?: string;
  year?: string;
  experienceHospitalName?: string;
  experienceStart?: string;
  experienceEnd?: string;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isBlocked?: Boolean;
}
const doctorSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    img: { type: String },
    phone: { type: String },
    gender: { type: String, enum: genderEnum },
    dob: { type: String },
    biography: { type: String },
    clinicName: { type: String },
    clinicAddress: { type: String },
    clinicImages: { type: [String] },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    price: { type: String },
    services: { type: [String] },
    specialization: { type: String },
    degree: { type: String },
    college: { type: String },
    completionYear: { type: String },
    experience: { type: String },
    designation: { type: String },
    award: { type: String },
    awardYear: { type: String },
    registration: { type: String },
    year: { type: String },
    experienceHospitalName: { type: String },
    experienceStart: { type: String },
    experienceEnd: { type: String },
    verified: { type: Boolean, default: false },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
export default Doctor;
