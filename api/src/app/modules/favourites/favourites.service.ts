// // import { Appointments, Favourites } from "@prisma/client";
// import prisma from "../../../shared/prisma";
// import ApiError from "../../../errors/apiError";
// import httpStatus from "http-status";
// import Appointment from '../../../models/Appointment.model'
// import  {Favourites, IFavourites} from '../../../models/Favourites.model'
// import {Patient} from '../../../models/Patient.model'

// const createFavourite = async (user: any, payload: any): Promise<IFavourites> => {
//     const isUserExist = await Patient.findById(user.userId);

//     if (!isUserExist) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!')
//     }

//     //check already have or not
//     const isFavourite = await Favourites.findOne({
//         patientId: user.userId,
//         doctorId: payload.doctorId
        
//     });

//     if (isFavourite) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'AllReady doctor is Favourite !!')
//     } else {

//         const favourites = await Favourites.create({
//             doctorId: payload.doctorId,
//             patientId: isUserExist._id,
//         });
//         await favourites.save();

//         return favourites;
//     }
// }
// const removeFavourite = async (user: any, payload: any): Promise<IFavourites> => {
//     const isUserExist = await Patient.findById(user.userId);

//     if (!isUserExist) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
//     }

//     const isFavourite = await Favourites.findOne({
//         doctorId: payload.doctorId,
//         patientId: user.userId,
//     });

//     if (!isFavourite) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Doctor is not in favourites !!');
//     }

//     // Xóa mục yêu thích từ cơ sở dữ liệu
//     const deletedFavourite = await Favourites.findByIdAndDelete(isFavourite._id);

//     return deletedFavourite;
// }

// const getPatientFavourites = async (user: any): Promise<IFavourites[]> => {
//     const isUserExist = await Patient.findById(user.userId);

//     if (!isUserExist) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
//     }

//     // Tìm kiếm mục yêu thích của bệnh nhân và populate thông tin của bác sĩ liên quan
//     const favourites = await Favourites.find({ patientId: isUserExist._id }).populate('doctor');

//     return favourites;
// }



// export const FavouritesService = {
//     createFavourite,
//     removeFavourite,
//     getPatientFavourites
// }