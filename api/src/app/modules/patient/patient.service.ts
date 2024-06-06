// import { Patient, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { create } from "./patientService";
import { IUpload } from "../../../interfaces/file";
import { Request } from "express";
import { CloudinaryHelper } from "../../../helpers/uploadHelper";
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import Patient, {IPatient} from '../../../models/Patient.model'
import Auth from '../../../models/auth.model'

const createPatient = async (payload: IPatient): Promise<IPatient> => {
    const result = await create(payload)
    return result;
}

const getAllPatients = async (): Promise<IPatient[] | null> => {
    const result = await Patient.find();
    return result;
}

const getPatient = async (id: string): Promise<IPatient | null> => {
    try {
        const result = await Patient.findById(id);

        return result;

    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get all patients');
    }
}

const deletePatient = async (id: string): Promise<any> => {
    try {
        await Patient.findByIdAndDelete(id);

        await Auth.findOneAndDelete({ email: id }); // Assuming email is unique identifier
   
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete patient');
    }
}

// : Promise<Patient>
const updatePatient = async (req: Request): Promise<IPatient | null> => {
    try {
        const file = req.file as IUpload;
        const id = req.params.id as string;
        const user = JSON.parse(req.body.data);

        if (file) {
            const uploadImage = await CloudinaryHelper.uploadFile(file);
            if (uploadImage) {
                user.img = uploadImage.secure_url;
            } else {
                throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Failed to update image !!');
            }
        }

        const result = await Patient.findByIdAndUpdate(id, user, { new: true });
        return result;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update patient');
    }
}

export const PatientService = {
    createPatient,
    updatePatient,
    getPatient,
    getAllPatients,
    deletePatient
}