import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import moment from "moment";
import Doctor from '../../../models/Doctor.model'
import mongoose from 'mongoose';
import {DoctorTimeSlotModel,ScheduleDayModel,IDoctorTimeSlot,IScheduleDay} from '../../../models/DoctorTimeSlot.model'

const createTimeSlot = async (payload: any): Promise<any | null> => {
    const doctorId = payload.doctorId;
    // console.log("payload: ", payload);
    // console.log("doctorId: ", doctorId);
    try {
        const isDoctor = await Doctor.findById(doctorId);
        if (!isDoctor) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor account not found.');
        }

        const isAlreadyExist = await DoctorTimeSlotModel.findOne({
            doctorId: isDoctor._id,
            day: payload.day
        });

        if (isAlreadyExist) {
            throw new ApiError(httpStatus.CONFLICT, 'Time slot already exists for the selected day. Please update or choose another day.');
        }

        const newTimeSlot = new DoctorTimeSlotModel({
            day: payload.day,
            doctorId: isDoctor._id,
            maximumPatient: '10',
            weekDay: payload.day,
            timeSlot: payload.timeSlot.map((item: any) => ({
                startTime: item.startTime,
                endTime: item.endTime
            }))
        });

      
        await newTimeSlot.save();

        if (!Array.isArray(newTimeSlot.timeSlot)) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Time slots data structure is invalid.');
        }

        for (const item of newTimeSlot.timeSlot) {
            await new ScheduleDayModel({
                startTime: item.startTime,
                endTime: item.endTime,
                doctorTimeSlotId: newTimeSlot._id 
            }).save();
        }

        console.log("create time slot: ", newTimeSlot);

       
        return newTimeSlot;
    } catch (error) {
       
        if (error instanceof ApiError) {
            console.error("ApiError creating time slot:", error.message);
            throw error;
        } else if (error instanceof Error) {
            console.error("Error creating time slot:", error.message);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        } else {
            console.error("Unexpected error creating time slot:", error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred while creating the timeslot.');
        }
    }
};


const deleteTimeSlot = async (id: string): Promise<IDoctorTimeSlot | null> => {
    const result = await DoctorTimeSlotModel.findByIdAndDelete(id);
    return result;
}

const getTimeSlot = async (id: string): Promise<IDoctorTimeSlot | null> => {
    const result = await DoctorTimeSlotModel.findById(id).populate('timeSlot');
    return result;
}

const getMyTimeSlot = async (user: any, filter: any): Promise<IDoctorTimeSlot[] | null> => {
    const { doctorId } = user;
    // console.log("get my time slot: ",user)
    const isDoctor = await Doctor.findById(doctorId);

    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!')
    }
    const conditions: any = { doctorId: isDoctor._id };

    if (filter.day) {
        conditions.day = filter.day;
    }

    const result = await DoctorTimeSlotModel.find(conditions).populate('timeSlot');
    return result;
}

const getAllTimeSlot = async (): Promise<IDoctorTimeSlot[] | null> => {
    const result = await DoctorTimeSlotModel.find().populate('timeSlot').populate({
        path: 'doctorId',
        select: 'firstName lastName'
    });
    return result;
}
const updateTimeSlot = async (payload: any): Promise<{ message: string }> => {
    const doctorId = payload.doctorId;
    const isDoctor = await Doctor.findById(doctorId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }
    const create = payload.create;
    const timeSlot = payload.timeSlot;
    
    if (create && create.length > 0) {
        const doctorTimeSlotId = create[0].doctorTimeSlotId;
        console.log("doctorTimeSlotId: ", doctorTimeSlotId);
        
        const doctorTimeSlot = await DoctorTimeSlotModel.findById(doctorTimeSlotId);
        console.log("doctorTimeSlot: ", doctorTimeSlot);
        
        if (!doctorTimeSlot) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Time Slot is not found !!');
        }

        for (const item of create) {
            await new ScheduleDayModel({
                startTime: item.startTime,
                endTime: item.endTime,
                doctorTimeSlotId: doctorTimeSlot._id
            }).save();
        }
    }

    if (timeSlot && timeSlot.length > 0) {
        for (const item of timeSlot) {
            await ScheduleDayModel.updateMany({ _id: item._id }, {
                startTime: item.startTime,
                endTime: item.endTime
            });
        }
    }

    return { message: 'Successfully Updated' };
};
const getAppointmentTimeOfEachDoctor = async (id: string, filter: any): Promise<any> => {
    const doctorTimeSlots = await DoctorTimeSlotModel.find({ doctorId: id }).populate('timeSlot');

    const allSlots = doctorTimeSlots.map((item) => ({
        day: item.day,
        timeSlot: item.timeSlot
    }));

    const generateTimeSlot = (timeSlot: any) => {
        const selectedTime: any[] = [];
        timeSlot.forEach((item: any) => {
            const interval = 30;
            const newTimeSlots: any[] = [];
            const day: string = item?.day;

            item?.timeSlot.forEach((slot: IScheduleDay) => {
                const startDate = moment(slot.startTime, 'hh:mm a');
                const endDate = moment(slot.endTime, 'hh:mm a');

                while (startDate < endDate) {
                    const selectableTime = {
                        id: newTimeSlots.length + 1,
                        time: startDate.format('hh:mm a')
                    };
                    newTimeSlots.push({ day, slot: selectableTime });
                    startDate.add(interval, 'minutes');
                }
            });

            if (filter.day) {
                const newTime = newTimeSlots.filter((item) => item.day === filter.day);
                selectedTime.push(...newTime);
            } else {
                selectedTime.push(...newTimeSlots);
            }
        });

        return selectedTime;
    };

    return generateTimeSlot(allSlots);
}

export const TimeSlotService = {
    updateTimeSlot,
    getAllTimeSlot,
    getTimeSlot,
    createTimeSlot,
    deleteTimeSlot,
    getMyTimeSlot,
    getAppointmentTimeOfEachDoctor
}