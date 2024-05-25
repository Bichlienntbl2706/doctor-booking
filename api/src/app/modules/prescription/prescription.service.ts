import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import prisma from "../../../shared/prisma";
// import { Prescription } from "@prisma/client";
import {Prescription,IPrescription} from '../../../models/Prescription.model'
import Doctor from '../../../models/Doctor.model'
import Appointment from '../../../models/Appointment.model'
import {Medicine} from '../../../models/Medicine.model'
import {Patient} from '../../../models/Patient.model'


const createPrescription = async (user: any, payload: any): Promise<{ message: string }> => {
    const { medicine, ...others } = payload;
    const { userId } = user;

    const isDoctor = await Doctor.findById(userId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    const isAppointment = await Appointment.findById(payload.appointmentId);
    if (!isAppointment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Appointment is not found !!');
    }

    // Tạo một đối tượng Prescription mới
    const prescription = await Prescription.create({
        ...others,
        doctorId: isDoctor.id,
        patientId: isAppointment.patientId,
        medicines: []
    });

    // Tạo các đối tượng Medicine liên quan và gắn chúng vào đối tượng Prescription
    const medicinePromises = medicine.map((med: any) =>
        Medicine.create({
            ...med,
            prescriptionId: prescription.id
        })
    );

    await Promise.all(medicinePromises);

    return { message: "Successfully Prescription Created" };
}


const updatePrescriptionAndAppointment = async (user: any, payload: any): Promise<{ message: string }> => {
    const { status, patientType, followUpdate, prescriptionId, ...others } = payload;
    const { userId } = user;

    const isDoctor = await Doctor.findById(userId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    const isPrescribed = await Prescription.findById(prescriptionId);
    if (!isPrescribed) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Prescription is not found !!');
    }

    await Appointment.updateOne({
        _id: isPrescribed.appointmentId
    }, {
        isFollowUp: followUpdate ? true : false,
        status: status,
        patientType: patientType,
    });

    await Prescription.updateOne({
        _id: prescriptionId
    }, {
        ...others,
    });

    return { message: "Successfully Prescription Updated" };
}

const getAllPrescriptions = async (): Promise<IPrescription[] | null> => {
    const result = await Prescription.find().populate('appointment', 'trackingId');
    return result;
}

const getPrescriptionById = async (id: string): Promise<IPrescription | null> => {
    const result = await Prescription.findById(id)
        .populate('medicines')
        .populate('appointment', 'scheduleDate scheduleTime status trackingId')
        .populate('doctor', 'firstName lastName designation email college address country state specialization')
        .populate('patient', 'firstName lastName gender dateOfBirth email bloodGroup address img city');
    return result;
}

const getPatientPrescriptionById = async (user: any): Promise<IPrescription[] | null> => {
    const { userId } = user;

    const isPatient = await Patient.findById(userId);
    if (!isPatient) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
    }

    const result = await Prescription.find({ patientId: userId })
        .populate('doctor', 'firstName lastName designation')
        .populate('appointment', 'scheduleDate scheduleTime status trackingId');
    
    return result;
}

const getDoctorPrescriptionById = async (user: any): Promise<IPrescription[] | null> => {
    const { userId } = user;

    const isDoctor = await Doctor.findById(userId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    const result = await Prescription.find({ doctorId: userId })
        .populate('medicines')
        .populate('patient');
    
    return result;
}

const deletePrescription = async (id: string): Promise<any> => {
    const result = await Prescription.findByIdAndDelete(id);
    return result;
}

const updatePrescription = async (id: string, payload: Partial<IPrescription>): Promise<IPrescription> => {
    const result = await Prescription.findByIdAndUpdate(id, payload, { new: true });
   
   // Kiểm tra nếu kết quả là null
    if (!result) {
        throw new Error(`Prescription with ID ${id} not found`);
    }
 return result;
}

export const PrescriptionService = {
    createPrescription,
    getDoctorPrescriptionById,
    updatePrescription,
    getPatientPrescriptionById,
    deletePrescription,
    getPrescriptionById,
    getAllPrescriptions,
    updatePrescriptionAndAppointment
}