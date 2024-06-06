import bcrypt from 'bcrypt';
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import { IDoctorFilters } from "./doctor.interface";
import calculatePagination, { IOption } from "../../../shared/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { Request } from "express";
import { IUpload } from "../../../interfaces/file";
import { CloudinaryHelper } from "../../../helpers/uploadHelper";
import moment from "moment";
import { EmailtTransporter } from "../../../helpers/emailTransporter";
import * as path from "path";
import config from "../../../config";
import { v4 as uuidv4 } from 'uuid';
import UserVerificationModel from '../../../models/UserVerification.model';
import DoctorModel, { IDoctor } from "../../../models/Doctor.model";
import {DoctorSearchableFields} from './doctor.interface'
import Auth from '../../../models/auth.model';

const sendVerificationEmail = async (data: IDoctor) => {
    const currentUrl = process.env.NODE_ENV === 'production' ? config.backendLiveUrl : config.backendLocalUrl;
    const uniqueString = uuidv4() + data.id;
    const uniqueStringHashed = await bcrypt.hash(uniqueString, 12);
    const url = `${currentUrl}/auth/user/verify/${data.id}/${uniqueString}`;
    const expiresDate = moment().add(6, 'hours');

    const verificationData = await UserVerificationModel.create({
        userId: data.id,
        expiresAt: expiresDate.toDate(),
        uniqueString: uniqueStringHashed
    });
    if (verificationData) {
        const pathName = path.join(__dirname, '../../../../template/verify.html');
        const obj = { link: url };
        const subject = "Email Verification";
        const toMail = data.email ?? ''; // Ensure toMail is not undefined
        if (!toMail) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User email is required for verification');
        }
        try {
            await EmailtTransporter({ pathName, replacementObj: obj, toMail, subject });
        } catch (err) {
            console.log(err);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to send email!');
        }
    }
}

const create = async (payload: any): Promise<any> => {
    try {
        const { password, ...otherData } = payload;
        const existEmail = await DoctorModel.findOne({ email: payload.email });
        if (existEmail) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists!");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const doctor = await DoctorModel.create({ ...otherData, password: hashedPassword });
       
        const authPayload = {
            email: payload.email,
            password: hashedPassword,
            role: 'doctor',
            userId: payload.userId // Assuming userId is a reference to doctor's _id
        };
        const auth = await Auth.create(authPayload);
        
        await sendVerificationEmail(doctor);
        return {doctor, auth};
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "error");
    }
}

const getAllDoctors = async (filters: IDoctorFilters, options: IOption): Promise<IGenericResponse<IDoctor[]>> => {
    const { limit = 10, page = 1, skip = 0 } = calculatePagination(options); // Default values to avoid undefined
    const { searchTerm, max, min, specialist, ...filterData } = filters;

    const andCondition: any[] = [];

    if (searchTerm) {
        andCondition.push({
            $or: DoctorSearchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            $and: Object.entries(filterData).map(([key, value]) => ({
                [key]: value
            }))
        });
    }

    if (min !== undefined || max !== undefined) {
        andCondition.push({
            price: { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER }
        });
    }

    if (specialist) {
        andCondition.push({
            services: { $regex: specialist, $options: 'i' }
        });
    }

    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    const result = await DoctorModel.find(whereCondition).skip(skip).limit(limit);

    const total = await DoctorModel.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result
    }
}

const getDoctor = async (id: string): Promise<any> => {
    try {
        const doctor = await DoctorModel.findById(id);
        if (!doctor) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
        }
        return doctor;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Can't get doctor");
    }
}

const deleteDoctor = async (id: string): Promise<any> => {
    try{
        const doctor = await DoctorModel.findByIdAndDelete(id);
        if(!doctor){
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');

        }
        const authDeletetionResult = await Auth.findByIdAndDelete({email:doctor.email});
        console.log(authDeletetionResult);
    }catch(error){
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete doctor');
    }
}

const updateDoctor = async (req: Request): Promise<IDoctor | null> => {
    const file = req.file as IUpload;
    const id = req.params.id as string;
    const user = JSON.parse(req.body.data);

    if (file) {
        const uploadImage = await CloudinaryHelper.uploadFile(file);
        if (uploadImage) {
            user.img = uploadImage.secure_url;
        } else {
            throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Failed to upload image');
        }
    }

    const result = await DoctorModel.findByIdAndUpdate(id, user, { new: true });
    return result;
}

export const DoctorService = {
    create,
    updateDoctor,
    deleteDoctor,
    getAllDoctors,
    getDoctor
}
