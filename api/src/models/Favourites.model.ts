import mongoose, {Schema, Document, Types}  from 'mongoose';

export interface IFavourites extends Document{
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
}

const FavouriteSchema: Schema = new Schema({
    doctorId: {type: mongoose.Types.ObjectId, ref: 'Doctor'},
    patientId: {type: mongoose.Types.ObjectId, ref: 'Patient'}
});

// const Favourites = mongoose.model<IFavourites>('Favourites',FavouriteSchema );
const Favourites = mongoose.models.Favourites || mongoose.model<IFavourites>('Favourites', FavouriteSchema);

export default Favourites;