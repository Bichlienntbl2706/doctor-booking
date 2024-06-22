import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import Favourites, {IFavourites } from '../../../models/Favourites.model';
import Patient from '../../../models/Patient.model';
import Auth from "../../../models/auth.model";
import Doctor from "../../../models/Doctor.model";


const createFavourite = async (user: any, payload: any): Promise<any | null> => {

    const authUser = await Auth.findById(user.userId);

    if (!authUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User is not found !!');
    }

    const patient = await Patient.findOne({ email: authUser.email });
    // console.log(patient);
    if (!patient) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
    }

    const isFavourite = await Favourites.findOne({ doctorId: payload.doctorId, patientId: patient._id });
    // console.log(payload.doctorId)

    if (isFavourite) {
        throw new ApiError(httpStatus.CONFLICT, 'Doctor is already a favourite !!');
    } else {
        payload.patientId = patient._id;
        // console.log(payload.patientId)
        const favourite = new Favourites({
            doctorId: payload.doctorId, 
            patientId: patient._id
        });
        // console.log("payload.doctorId", payload.doctorId); 
        // console.log("patientId", patient._id)
        await favourite.save();
        console.log(favourite)
        return favourite;
    }
}


const removeFavourite = async (user: any, payload: any): Promise<any | null> => {
    const { patientId } = user;
    console.log('User:', user);
    console.log('Payload:', payload);

    // Check if payload has doctorId
    if (!payload || !payload.doctorId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor ID is missing from payload.');
    }

    // Extract doctorId from payload
    const doctorId = payload.doctorId;
    
    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient is not found !!');
    }

    const favourite = await Favourites.findOne({
        doctorId: doctorId, // Ensure doctorId is of ObjectId type
        patientId: patient._id // Ensure patientId is of ObjectId type
    });
    // console.log('Payload doctorId:', doctorId);
    // console.log('Favourite:', favourite);

    if (!favourite) {
        throw new ApiError(httpStatus.CONFLICT, 'Doctor is not a favourite !!');
    }

    const deleteFavourite = await Favourites.findByIdAndDelete(favourite._id);
    console.log('Deleted Favourite ID:', favourite._id);
    return deleteFavourite;
};


const getPatientFavourites = async (user: any): Promise<IFavourites[]> => {
    const { patientId } = user; 
    // console.log(user)

    const isPatient = await Patient.findById(patientId); 
    // console.log(isPatient)
    if(!isPatient) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient is not found !!')
    }

    const favourites = await Favourites.find({ patientId: isPatient._id }).populate('doctorId');
    
    // console.log("patientId: ", isPatient._id)
    // console.log("Favou", favourites); 

    return favourites.map(fav => fav.toObject() as IFavourites); // Casting to IFavourites[]
};



export const FavouritesService = {
    createFavourite,
    removeFavourite,
    getPatientFavourites,
};
