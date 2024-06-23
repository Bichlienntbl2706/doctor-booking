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
import { ObjectId } from 'mongodb';
import { Document, Types } from 'mongoose';
// const { ObjectId } = mongoose.Types;

// const createAppointment = async (payload: any): Promise<any> => {
//     const { patientInfo, payment } = payload;
//     console.log("payload crete appoi: ", payload)
//     // Check if the patient exists
//     if (patientInfo.patientId) {
//         const isUserExist = await Patient.findById(patientInfo.patientId);
//         if (!isUserExist) {
//             patientInfo['patientId'] = null;
//         }
//     }

//     // Check if the doctor exists
//     const isDoctorExist = await Doctor.findById(patientInfo.doctorId);
//     if (!isDoctorExist) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
//     }

//     patientInfo['paymentStatus'] = 'paid'; // paymentStatus.paid

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const previousAppointment = await Appointment.findOne({}).sort({ createdAt: -1 }).session(session);
//         const appointmentLastNumber = (previousAppointment?.trackingId ?? '').slice(-3);
//         const lastDigit = (Number(appointmentLastNumber) + 1 || 0).toString().padStart(3, '0');

//         const first3DigitName = patientInfo?.firstName?.slice(0, 3).toUpperCase();
//         const year = moment().year();
//         const month = (moment().month() + 1).toString().padStart(2, '0');
//         const day = (moment().date()).toString().padStart(2, '0');
//         const trackingId = first3DigitName + year + month + day + lastDigit || '001';
//         patientInfo['trackingId'] = trackingId;

//         const appointment = await Appointment.create([patientInfo], { session });

//         const { paymentMethod, paymentType } = payment;
//         const docFee = Number(isDoctorExist.price);
//         const vat = (15 / 100) * (docFee + 10);

//         if (appointment[0]._id) {
//             await Payment.create([{
//                 appointmentId: appointment[0]._id,
//                 bookingFee: 10,
//                 paymentMethod: paymentMethod,
//                 paymentType: paymentType,
//                 vat: vat,
//                 DoctorFee: docFee,
//                 totalAmount: (vat + docFee),
//             }], { session });
//         }

//         const pathName = path.join(__dirname, '../../../../template/appointment.html');

//         // Populate the doctor and patient details
//         const populatedAppointment = await Appointment.findById(appointment[0]._id)
//             .populate('doctorId')
//             .populate('patientId')
//             .exec();

//         if (!populatedAppointment) {
//             throw new Error('Failed to populate appointment');
//         }

//         // Type casting to access populated fields correctly
//         const doctor: any = populatedAppointment.doctorId;
//         const patient: any = populatedAppointment.patientId;

//         const appointmentObj = {
//             created: moment(populatedAppointment.createdAt).format('LL'),
//             trackingId: populatedAppointment.trackingId,
//             patientType: populatedAppointment.patientType,
//             status: populatedAppointment.status,
//             paymentStatus: populatedAppointment.paymentStatus,
//             prescriptionStatus: populatedAppointment.prescriptionStatus,
//             scheduleDate: moment(populatedAppointment.scheduleDate).format('LL'),
//             scheduleTime: populatedAppointment.scheduleTime,
//             doctorImg: doctor?.img,
//             doctorFirstName: doctor?.firstName,
//             doctorLastName: doctor?.lastName,
//             specialization: doctor?.specialization,
//             designation: doctor?.designation,
//             college: doctor?.college,
//             patientImg: patient?.img,
//             patientfirstName: patient?.firstName,
//             patientLastName: patient?.lastName,
//             dateOfBirth: moment().diff(moment(patient?.dob), 'years'),
//             bloodGroup: patient?.bloodGroup,
//             city: patient?.city,
//             state: patient?.state,
//             country: patient?.country
//         };

//         const replacementObj = appointmentObj;
//         const subject = `Appointment Confirm With Dr ${doctor?.firstName + ' ' + doctor?.lastName} at ${populatedAppointment.scheduleDate} ${populatedAppointment.scheduleTime}`;
//         const toMail = `${populatedAppointment.email},${doctor?.email}`;
//         EmailtTransporter({ pathName, replacementObj, toMail, subject });

//         await session.commitTransaction();
//         session.endSession();

//         return populatedAppointment;
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         throw error;
//     }
// };

const createAppointment = async (payload: any): Promise<any> => {
    const { patientInfo, payment } = payload;

    try {
        // Kiểm tra và xử lý thông tin bệnh nhân
        if (patientInfo.patientId) {
            const isUserExist = await Patient.findById(patientInfo.patientId);
            if (!isUserExist) {
                patientInfo.patientId = null; // Nếu không tìm thấy bệnh nhân, gán null
            }
        }

        // Kiểm tra và xác nhận tồn tại của bác sĩ
        const isDoctorExist = await Doctor.findById(patientInfo.doctorId);
        if (!isDoctorExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
        }

        // Thiết lập trạng thái thanh toán
        patientInfo.paymentStatus = 'paid';

        // Tạo trackingId cho cuộc hẹn
        const previousAppointment = await Appointment.findOne({}, {}, { sort: { 'createdAt': -1 } });
        const appointmentLastNumber = (previousAppointment?.trackingId ?? '').slice(-3);
        const lastDigit = (Number(appointmentLastNumber) + 1 || 0).toString().padStart(3, '0');
        const first3DigitName = patientInfo.firstName?.slice(0, 3).toUpperCase();
        const year = moment().year();
        const month = (moment().month() + 1).toString().padStart(2, '0');
        const day = moment().dayOfYear().toString().padStart(2, '0');
        const trackingId = first3DigitName + year + month + day + lastDigit || '001';
        patientInfo.trackingId = trackingId;
        console.log("TrackingId: ", trackingId);
        console.log("Creating appointment with data: ", patientInfo);

        // Tạo appointment và lưu vào database
        const appointment = await Appointment.create([patientInfo]);
        console.log("Appointment created: ", appointment);

        if (appointment.length === 0) {
            throw new Error('Failed to create appointment');
        }

        // Calculate doctor fee, VAT, and total amount for payment
        const docFee = parseFloat(isDoctorExist.price || '0');
        const vat = (15 / 100) * (docFee + 10);

        if (isNaN(docFee)) {
            throw new Error('Invalid DoctorFee');
        }

        // Create payment record
        const newPayment = new Payment({
            appointmentId: appointment[0]._id,
            bookingFee: 10,
            paymentMethod: payment.paymentMethod,
            paymentType: payment.paymentType,
            vat: parseFloat(vat.toFixed(2)),
            DoctorFee: docFee,
            totalAmount: parseFloat((vat + docFee).toFixed(2)),
        });

        await newPayment.save();

        // Fetch doctor and patient details
        const doctor = await Doctor.findById(appointment[0].doctorId).lean();
        const patient = await Patient.findById(appointment[0].patientId).lean();

        // Handle errors if doctor or patient not found
        if (!doctor) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found after creation');
        }

        if (!patient) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Patient not found after creation');
        }

        // Prepare data for email
        const appointmentObj = {
            created: moment(appointment[0].createdAt).format('LL'),
            trackingId: appointment[0].trackingId,
            patientType: appointment[0].patientType,
            status: appointment[0].status,
            paymentStatus: appointment[0].paymentStatus,
            prescriptionStatus: appointment[0].prescriptionStatus,
            scheduleDate: moment(appointment[0].scheduleDate).format('LL'),
            scheduleTime: appointment[0].scheduleTime,
            doctorImg: doctor.img,
            doctorFirstName: doctor.firstName,
            doctorLastName: doctor.lastName,
            specialization: doctor.specialization,
            designation: doctor.designation,
            college: doctor.college,
            patientImg: patient.img,
            patientfirstName: patient.firstName,
            patientLastName: patient.lastName,
            dateOfBirth: moment().diff(moment(patient.dateOfBirth), 'years'),
            bloodGroup: patient.bloodGroup,
            city: patient.city,
            state: patient.state,
            country: patient.country,
        };

        // Send email
        const pathName = path.join(__dirname, '../../../../template/meeting.html')
        const replacementObj = appointmentObj;
        const subject = `Appointment Confirmed With Dr ${doctor.firstName} ${doctor.lastName} at ${appointment[0].scheduleDate} ${appointment[0].scheduleTime}`;
        const toMail = `${appointment[0].email},${doctor.email}`;
        await EmailtTransporter({ pathName, replacementObj, toMail, subject });

        return appointment; // Return the created appointment
    } catch (error) {
        // Log the error for debugging
        console.error("Error creating appointment: ", error);
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

// const getAppointment = async (id: string): Promise<any | null> => {
//     const result = await Appointment.findById(id)
//     .populate('doctorId')
//     .populate('patientId');
//     return result;
// };

const getAppointment = async (id: string): Promise<any | null> => {
    try {
        const appointment = await Appointment.findById(id)
            .populate('doctorId')
            .populate('patientId');

        console.log(appointment)

        if (!appointment) {
            throw new Error(`Appointment with id ${id} not found`);
        }

        return appointment;
    } catch (error) {
        console.error('Error fetching appointment by id:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

const getAppointmentByTrackingId = async (data: any): Promise<any> => {
    try {
        const { id } = data;
        // console.log("id: ", id);
        
        let result;
        if (Types.ObjectId.isValid(id)) {
            const objectId = new Types.ObjectId(id);
            result = await Appointment.findOne({ trackingId: objectId })
                .populate('doctorId', 'firstName lastName designation college degree img')
                .populate('patientId', 'firstName lastName address city country state img');
        } else {
            // Nếu id không phải là ObjectId, tìm kiếm bằng trackingId trực tiếp
            result = await Appointment.findOne({ trackingId: id })
                .populate('doctorId', 'firstName lastName designation college degree img')
                .populate('patientId', 'firstName lastName address city country state img');
        }
        
        // console.log("data appointment tracking: ", result);
        return result;
    } catch (error) {
        console.error('Error fetching appointment by id:', error);
        throw error;
    }
}

const getPatientAppointmentById = async (user: any): Promise<any[] | null> => {
    const { userId } = user;

    const result = await Appointment.find({ patientId: userId })
    .populate('doctorId');

    return result;
};


const getPaymentInfoViaAppintmentId = async (id: string): Promise<any | null> => {
    console.log("id getPaymentInfoViaAppint: ", id);
    
   try{
    const objectId = new ObjectId(id);

        const result = await Payment.findOne({ appointmentId: objectId }) //{ appointmentId: objectId }
        .populate({
            path: 'appointmentId',
            populate: [
                { path: 'patientId', select: 'firstName lastName address country city' },
                { path: 'doctorId', select: 'firstName lastName address country city' }
            ]
        });

        console.log("result get payment info: ", result);
        return result;
   } catch (error) {
        console.error("Error in getPaymentInfoViaAppintmentId: ", error);
        return null;
    }
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
    // {appointmentId: isUserExist._id }
    const result = await Payment.find()
    .populate({
        path: 'appointmentId',
        populate: {
            path: 'patientId',
            select: 'firstName lastName img'
        }
    });
    console.log("result: ", result)
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
    const doctorId = new Types.ObjectId(user.doctorId);

    // Verify if the doctor exists
    const isDoctor = await Doctor.findById(doctorId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    // Construct the query condition
    let andCondition: { doctorId: Types.ObjectId, scheduleDate?: { $gte?: string, $lt?: string } } = { doctorId: doctorId };

    if (filter.sortBy === 'today') {
        const today = moment().format('YYYY-MM-DD'); 
        const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD'); 

        andCondition.scheduleDate = {
            $gte: today,
            $lt: tomorrow
        };
    } else if (filter.sortBy === 'upcoming') {
        const upcomingDate = moment().format('YYYY-MM-DD'); 
        andCondition.scheduleDate = {
            $gte: upcomingDate
        };
    }

    // console.log('Query condition:', andCondition);

    // Execute the query with the constructed condition
    const result = await Appointment.find(andCondition)
    .populate('patientId')
    .populate({
        path: 'prescriptionId'
    })
    .exec();

    // const filteredResult = result.filter(appointment => 
    //     appointment.status !== 'Completed' &&
    //     appointment.status !== 'archived' &&
    //     appointment.status !== 'cancel'
    // );

    // console.log('Filtered Result:', filteredResult);
    return result;
};


const getDoctorPatients = async (user: any): Promise<any[]> => {
    const doctorId = user.doctorId;
    // console.log('doctorId: ', doctorId);

    const isDoctor = await Doctor.findById(doctorId);
    // console.log('isDoctor: ', isDoctor);

    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    // Chuyển đổi doctorId sang ObjectId nếu cần
    const objectIdDoctorId = new ObjectId(doctorId);

    const appointments = await Appointment.find({ doctorId: objectIdDoctorId }).distinct('patientId');
    // console.log('Appointment patient IDs: ', appointments);

    if (appointments.length === 0) {
        console.log('No appointments found for this doctor.');
        return [];
    }

    const patientList = await Patient.find({ _id: { $in: appointments } });
    // console.log('Patient list: ', patientList);

    return patientList;
};



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
