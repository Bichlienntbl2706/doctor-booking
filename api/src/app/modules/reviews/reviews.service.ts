// import { Reviews } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import calculatePagination, { IOption } from "../../../shared/paginationHelper";
import {Review, IReview} from '../../../models/Review.model'
import {Patient} from '../../../models/Patient.model'
import Doctor from '../../../models/Doctor.model'

const create = async (user: any, payload: IReview): Promise<IReview> => {
    try{
        const isUserExist = await Patient.findById(user.userId)

        if (!isUserExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!')
        }
        const isDoctorExist = await Doctor.findById(payload.doctorId)

        if (!isDoctorExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
        }
        const review = new Review(payload);
        review.patientId = isUserExist.id;
        const result = await review.save();

        return result;
    }catch(error: any){
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
}

const getAllReviews = async (): Promise<IReview[] | null> => {
    try {
        const result = await Review.find().populate('doctor', 'firstName lastName img').populate('patient', 'firstName lastName img');
        return result;
    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
}

const getSingleReview = async (id: string): Promise<IReview | null> => {
    try {
        const result = await Review.findById(id)
        .populate('doctor', 'firstName lastName')
        .populate('patient', 'firstName lastName');
        return result;
    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
}

const getDoctorReviews = async (id: string): Promise<IReview[] | null> => {
    try {
        const result = await Review.find({ doctorId: id })
        .populate('doctor', 'firstName lastName').
        populate('patient', 'firstName lastName');
        return result;
    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
}

const deleteReviews = async (id: string): Promise<IReview> => {
    try {
        const result = await Review.findByIdAndDelete(id);
        if (!result) {
            throw new Error(`Reviews not found`);
        }
        return result;
    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
}

const updateReview = async (id: string, payload: Partial<IReview>): Promise<IReview> => {
    try {
        const result = await Review.findByIdAndUpdate(id, payload, { new: true });
        if (!result) {
            throw new Error(`Reviews can not update`);
        }
        return result;
    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
}

const replyReviewByDoctor = async (user: any, id: string, payload: Partial<IReview>): Promise<IReview> => {
    try{
        const isUserExist = await Doctor.findById(user.userId)
    
        if (!isUserExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
        }
    
        const result = await Review.findByIdAndUpdate(id, { response: payload.response }, { new: true });
        if (!result) {
            throw new Error(`Reviews can not rely`);
        }
        return result;

    }catch(error:any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
}


export const ReviewService = {
    create,
    getAllReviews,
    getDoctorReviews,
    deleteReviews,
    updateReview,
    getSingleReview,
    replyReviewByDoctor
}