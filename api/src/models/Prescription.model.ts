import mongoose, {Schema, Document, Types}  from 'mongoose';


export interface IPrescription extends Document{
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    appointmentId:Types.ObjectId;
    followUpdate?:string;
    instruction?:string;
    isFullfilled?:boolean;
    isArchived?:boolean;
    diagnosis?:string;
    disease?:string;
    test?:string;
    createdAt?: Date;  
    updatedAt?: Date;  
    medicines?: Types.ObjectId[];
}

const PrescriptionSchema: Schema = new Schema({
    doctorId: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
    patientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
    appointmentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'},
    followUpdate:{type:String},
    instruction:{type:String},
    isFullfilled:{type:Boolean},
    isArchived:{type:Boolean, default: true},
    diagnosis:{type:String},
    disease:{type:String},
    test: {type:String},
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }]
}, { timestamps: true });

const Prescription = mongoose.model<IPrescription>('Prescription', PrescriptionSchema );

export default Prescription;