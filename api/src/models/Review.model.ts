
// import mongoose, {Schema, Document,Types} from 'mongoose'

// export interface IReview extends Document{
//     patientId: Types.ObjectId;
//     doctorId: Types.ObjectId;
//     description: string;
//     star: string;
//     isRecommended: boolean;
//     response: string;
//     createdAt?: Date;  
//     updatedAt?: Date;  
// }

// const ReviewSchema = new Schema({
//     doctorId:{type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
//     patientId:{type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
//     description:	{type: String},
//     star:{type: String},
//     isRecommended:{type: Boolean},
//     response:{type: String},

// },{ timestamps: true })

// const Review = mongoose.model<IReview>('Reviews',ReviewSchema )

// export {Review}

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  description: string;
  star: string;
  isRecommended: boolean;
  response: string;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

const ReviewSchema = new Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    description: { type: String },
    star: { type: String },
    isRecommended: { type: Boolean },
    response: { type: String },
    createdAt: Date,
    updatedAt: Date,
    id: {type: String}
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Reviews", ReviewSchema);

export default Review;
