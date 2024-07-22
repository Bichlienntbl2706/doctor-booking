// // Define the Admin schema
// import mongoose, { Schema, Document } from "mongoose";

// // Define the interface for the Admin document
// export interface IAdmin extends Document {
//   role: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   dateOfBirth: Date;
//   mobile: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   gender: string;
//   country: string;
//   address: string;
//   img?: string;
// }

// // Define the Admin schema
// const adminSchema: Schema<IAdmin> = new Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     dateOfBirth: {
//       type: Date,
//     },
//     mobile: {
//       type: String,
//     },
//     city: {
//       type: String,
//     },
//     state: {
//       type: String,
//     },
//     zipCode: {
//       type: String,
//     },
//     gender: {
//       type: String,
//     },
//     country: {
//       type: String,
//     },
//     address: {
//       type: String,
//     },
//     img: {
//       type: String,
//     },
//     role: {
//       type: String,
//       enum: ["admin"],
//       default: "admin",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Create and export the model
// const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
// export default Admin;

import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Admin document
export interface IAdmin extends Document {
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
  role?: string;
  createdAt?: Date; 
  updatedAt?: Date; 
}

// Define the Admin schema
const adminSchema: Schema<IAdmin> = new Schema(
  {
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
    img: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;
