import mongoose from 'mongoose';
import Appointment from '../../../models/Appointment.model';
import Patient from '../../../models/Patient.model';
import Payment from '../../../models/Payment.model';
import Doctor from '../../../models/Doctor.model';
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import moment from 'moment';
import { EmailtTransporter } from "../../../helpers/emailTransporter";
import * as path from 'path';
import config from "../../../config";

const createAppointment = async (payload: any): Promise<any> => {
    const { patientInfo, payment } = payload;

    // Check if the patient exists
    if (patientInfo.patientId) {
        const isUserExist = await Patient.findById(patientInfo.patientId);
        if (!isUserExist) {
            patientInfo['patientId'] = null;
        }
    }

    // Check if the doctor exists
    const isDoctorExist = await Doctor.findById(patientInfo.doctorId);
    if (!isDoctorExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    patientInfo['paymentStatus'] = 'paid'; // paymentStatus.paid

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const previousAppointment = await Appointment.findOne({}).sort({ createdAt: -1 }).session(session);
        const appointmentLastNumber = (previousAppointment?.trackingId ?? '').slice(-3);
        const lastDigit = (Number(appointmentLastNumber) + 1 || 0).toString().padStart(3, '0');

        const first3DigitName = patientInfo?.firstName?.slice(0, 3).toUpperCase();
        const year = moment().year();
        const month = (moment().month() + 1).toString().padStart(2, '0');
        const day = (moment().date()).toString().padStart(2, '0');
        const trackingId = first3DigitName + year + month + day + lastDigit || '001';
        patientInfo['trackingId'] = trackingId;

        const appointment = await Appointment.create([patientInfo], { session });

        const { paymentMethod, paymentType } = payment;
        const docFee = Number(isDoctorExist.price);
        const vat = (15 / 100) * (docFee + 10);

        if (appointment[0]._id) {
            await Payment.create([{
                appointmentId: appointment[0]._id,
                bookingFee: 10,
                paymentMethod: paymentMethod,
                paymentType: paymentType,
                vat: vat,
                DoctorFee: docFee,
                totalAmount: (vat + docFee),
            }], { session });
        }

        const pathName = path.join(__dirname, '../../../../template/appointment.html');

        // Populate the doctor and patient details
        const populatedAppointment = await Appointment.findById(appointment[0]._id)
            .populate('doctorId')
            .populate('patientId')
            .exec();

        if (!populatedAppointment) {
            throw new Error('Failed to populate appointment');
        }

        // Type casting to access populated fields correctly
        const doctor: any = populatedAppointment.doctorId;
        const patient: any = populatedAppointment.patientId;

        const appointmentObj = {
            created: moment(populatedAppointment.createdAt).format('LL'),
            trackingId: populatedAppointment.trackingId,
            patientType: populatedAppointment.patientType,
            status: populatedAppointment.status,
            paymentStatus: populatedAppointment.paymentStatus,
            prescriptionStatus: populatedAppointment.prescriptionStatus,
            scheduleDate: moment(populatedAppointment.scheduleDate).format('LL'),
            scheduleTime: populatedAppointment.scheduleTime,
            doctorImg: doctor?.img,
            doctorFirstName: doctor?.firstName,
            doctorLastName: doctor?.lastName,
            specialization: doctor?.specialization,
            designation: doctor?.designation,
            college: doctor?.college,
            patientImg: patient?.img,
            patientfirstName: patient?.firstName,
            patientLastName: patient?.lastName,
            dateOfBirth: moment().diff(moment(patient?.dob), 'years'),
            bloodGroup: patient?.bloodGroup,
            city: patient?.city,
            state: patient?.state,
            country: patient?.country
        };

        const replacementObj = appointmentObj;
        const subject = `Appointment Confirm With Dr ${doctor?.firstName + ' ' + doctor?.lastName} at ${populatedAppointment.scheduleDate} ${populatedAppointment.scheduleTime}`;
        const toMail = `${populatedAppointment.email},${doctor?.email}`;
        EmailtTransporter({ pathName, replacementObj, toMail, subject });

        await session.commitTransaction();
        session.endSession();

        return populatedAppointment;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const createAppointmentByUnAuthenticateUser =  async (payload: any): Promise<any> => {
    const { patientInfo, payment } = payload;
    // Check if the patient exists
    if (patientInfo.patientId) {
        const isUserExist = await Patient.findById(patientInfo.patientId);
        if (!isUserExist) {
            patientInfo['patientId'] = null;
        }
    }
   
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const previousAppointment = await Appointment.findOne({}).sort({ createdAt: -1 }).session(session);
        const appointmentLastNumber = (previousAppointment?.trackingId ?? '').slice(-3);
        const lastDigit = (Number(appointmentLastNumber) + 1 || 0).toString().padStart(3, '0');
        const year = moment().year();
        const month = (moment().month() + 1).toString().padStart(2, '0');
        const day = (moment().date()).toString().padStart(2, '0');
        const trackingId = 'UNU' + year + month + day + lastDigit || '0001';
        patientInfo['trackingId'] = trackingId;
        patientInfo['doctorId'] = config.defaultAdminDoctor;

        const appointment = await Appointment.create([patientInfo], { session });

        const { paymentMethod, paymentType } = payment;
        const vat = (15 / 100) * (60 + 10);

        if (appointment[0].id) {
            await Payment.create([{
                appointmentId: appointment[0].id,
                bookingFee: 10,
                paymentMethod: paymentMethod,
                paymentType: paymentType,
                vat: vat,
                DoctorFee: 60,
                totalAmount: (vat + 60),
            }], { session });
        }

        const appointmentObj = {
            created: moment(appointment[0].createdAt).format('LL'),
            trackingId: appointment[0].trackingId,
            patientType: appointment[0].patientType,
            status: appointment[0].status,
            paymentStatus: appointment[0].paymentStatus,
            prescriptionStatus: appointment[0].prescriptionStatus,
            scheduleDate: moment(appointment[0].scheduleDate).format('LL'),
            scheduleTime: appointment[0].scheduleTime,
        };

        const pathName = path.join(__dirname, '../../../../template/meeting.html');
        const replacementObj = appointmentObj;
        const subject = `Appointment Confirm at ${appointment[0].scheduleDate} ${appointment[0].scheduleTime}`;
        const toMail = `${appointment[0].email}`;
        EmailtTransporter({ pathName, replacementObj, toMail, subject });

        await session.commitTransaction();
        session.endSession();

        return appointment[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

const getAllAppointments = async (): Promise<any[]> => {
    const result = await Appointment.find();
    return result;
};

const getAppointment = async (id: string): Promise<any | null> => {
    const result = await Appointment.findById(id)
    .populate('doctor')
    .populate('patient');
    return result;
};
const getAppointmentByTrackingId = async (data: any): Promise<any> => {
    const { id } = data;
    const result = await Appointment.findById({ trackingId: id })
    .populate('doctor', 'firstName lastName designation college degree img')
    .populate('patient', 'firstName lastName address city country state img');
    return result;

}

const getPatientAppointmentById = async (user: any): Promise<any[] | null> => {
    const { userId } = user;

    const result = await Appointment.find({ patientId: userId })
    .populate('doctor');

    return result;
};

const getPaymentInfoViaAppintmentId = async (id: string): Promise<any | null> => {
    const result = await Payment.findOne({ appointmentId: id })
        .populate({
            path: 'appointment',
            populate: [
                { path: 'patient', select: 'firstName lastName address country city' },
                { path: 'doctor', select: 'firstName lastName address country city' }
            ]
        });

    return result;
};
const getPatientPaymentInfo = async (user: any): Promise<any[]> => {
    const { userId } = user;
    
    const isUserExist = await Patient.findById(userId)

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!')
    }


    const result = await Patient.find({ 'appointment.patientId': isUserExist._id })
    .populate({
        path: 'appointment',
        populate: {
            path: 'doctor',
            select: 'firstName lastName designation'
        }
    });
    return result;
}

const getDoctorInvoices = async (user: any): Promise<any[] | null> => {
    const { doctorId } = user;

    const isUserExist = await Doctor.findById(doctorId)
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
    }
    const result = await Payment.find({ 'appointment.doctorId': isUserExist._id })
    .populate({
        path: 'appointment',
        populate: {
            path: 'patient',
            select: 'firstName lastName'
        }
    });
    return result;
}
const deleteAppointment = async (id: string): Promise<any> => {
    const result = await Appointment.findByIdAndDelete(id);
    return result;
}

const updateAppointment = async (id: string, payload: Partial<any>): Promise<any> => {
    const result = await Appointment.findByIdAndUpdate(id, payload, { new: true })
    return result;
}
const getDoctorAppointmentsById = async (user: any, filter: any): Promise<any[] | null> => {
    const { doctorId } = user;
    const isDoctor = await Doctor.findById(doctorId)
    if (!isDoctor) { throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!') }

    let andCondition: any = { doctorId: doctorId };

    if (filter.sortBy == 'today') {
        const today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const tomorrow = moment(today).add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
//   const today = moment().startOf('day').toDate();
// const tomorrow = moment(today).add(1, 'days').toDate();

        andCondition.scheduleDate = {
            $gte: today,
            $lt: tomorrow
        };
    }
    if (filter.sortBy == 'upcoming') {
        const upcomingDate = moment().startOf('day').add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        andCondition.scheduleDate = {
            $gte: upcomingDate
        };
    }
    const whereConditions = andCondition ? andCondition : {}

    const result = await Appointment.find(whereConditions)
    .populate('patient')
    .populate({
        path: 'prescription',
        select: 'id'
    });
    return result;
}
const getDoctorPatients = async (user: any): Promise<any[]> => {
    const { doctorId } = user;
    const isDoctor = await Doctor.findById(doctorId)

    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
    }

    const appointments = await Appointment.find({ doctorId: doctorId }).distinct('patientId');
    const patientList = await Patient.find({ _id: { $in: appointments } });
    return patientList;
}

const updateAppointmentByDoctor = async (user: any, payload: Partial<any>): Promise<any | null> => {
    const { userId } = user;
    const isDoctor = await Doctor.findById(userId);

    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
    }
    const result = await Appointment.findByIdAndUpdate(payload.id, payload, { new: true });
    return result;
}

export const AppointmentService = {
    createAppointment,
    createAppointmentByUnAuthenticateUser,
    getAllAppointments,
    getAppointment,
    getAppointmentByTrackingId,
    getPatientAppointmentById,
    getPaymentInfoViaAppintmentId,
    getPatientPaymentInfo,
    getDoctorInvoices,
    deleteAppointment,
    updateAppointment,
    getDoctorAppointmentsById,
    getDoctorPatients,
    updateAppointmentByDoctor
}
