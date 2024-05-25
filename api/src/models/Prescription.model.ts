import mongoose, {Schema, Document, Types}  from 'mongoose';


export interface IPrescription extends Document{
    id: string;
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    appointmentId:Types.ObjectId;
    followUpdate?:string;
    instruction?:string;
    isFullfilled?:boolean;
    isArchived?:boolean;
    daignosis?:string;
    disease?:string;
    createdAt?: Date;  
    updatedAt?: Date;  
}

const PrescriptionSchema: Schema = new Schema({
    id: {type: String},
    doctorId: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
    patientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
    appointmentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'},
    followUpdate:{type:String},
    instruction:{type:String},
    isFullfilled:{type:Boolean},
    isArchived:{type:Boolean},
    daignosis:{type:String},
    disease:{type:String},
    test: {type:String},
}, { timestamps: true });

const Prescription = mongoose.model<IPrescription>('Prescription', PrescriptionSchema );

export { Prescription};