import mongoose, {Schema, Document, Types}  from 'mongoose';

export interface IFavourites extends Document{
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
}

const FavouriteSchema: Schema = new Schema({
    doctorId: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
    patientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'}
});

const Favourites = mongoose.model('Favourites',FavouriteSchema );

export { Favourites};