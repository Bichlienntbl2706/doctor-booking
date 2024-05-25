import mongoose, {Schema, Document, Types}  from 'mongoose';


export interface IMedicine extends Document{
    id: string;
    prescriptionId: Types.ObjectId;	
    medicine?:string;
    dosage?:string;
    frequency?:string;
    duration?: string;
    createdAt?: Date;  
    updatedAt?: Date;  
}

const MedicineSchema: Schema = new Schema({
    id: {type: String},
    prescriptionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Prescription'},
    medicine:{type: String},
    dosage:{type: String},
    frequency:{type: String},
    duration:{type: String},
},{timestamps:true});

const Medicine = mongoose.model<IMedicine>('Favourites',MedicineSchema );

export { Medicine};