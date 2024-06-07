
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import Appointment from '../../../models/Appointment.model';
import Favourites, {IFavourites } from '../../../models/Favourites.model';
import Patient from '../../../models/Patient.model';
import mongoose from 'mongoose';

const createFavourite = async (user: any, payload: any): Promise<IFavourites> => {
    const isUserExist = await Patient.findById(user.userId).exec();

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
    }

    const isFavourite = await Favourites.findOne({
        patientId: user.userId,
        doctorId: payload.doctorId,
    }).exec();

    if (isFavourite) {
        throw new ApiError(httpStatus.CONFLICT, 'Already doctor is Favourite !!');
    }

    const favourites = new Favourites({
        doctorId: payload.doctorId,
        patientId: isUserExist._id,
    });

    await favourites.save();
    return favourites.toObject() as IFavourites; // Casting to IFavourites
};

const removeFavourite = async (user: any, payload: any): Promise<IFavourites> => {
    const isUserExist = await Patient.findById(user.userId).exec();

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
    }

    const isFavourite = await Favourites.findOne({
        doctorId: payload.doctorId,
        patientId: user.userId,
    }).exec();

    if (!isFavourite) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor is not in favourites !!');
    }

    const deletedFavourite = await Favourites.findByIdAndDelete(isFavourite._id).exec();

    return deletedFavourite?.toObject() as IFavourites; // Casting to IFavourites
};

const getPatientFavourites = async (user: any): Promise<IFavourites[]> => {
    const isUserExist = await Patient.findById(user.userId).exec();

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
    }

    const favourites = await Favourites.find({ patientId: isUserExist._id })
        .populate('doctor')
        .exec();

    return favourites.map(fav => fav.toObject() as IFavourites); // Casting to IFavourites[]
};

export const FavouritesService = {
    createFavourite,
    removeFavourite,
    getPatientFavourites,
};
