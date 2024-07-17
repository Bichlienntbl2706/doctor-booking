import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import moment from "moment";
import Doctor from '../../../models/Doctor.model'
import mongoose from 'mongoose';
import {DoctorTimeSlotModel,ScheduleDayModel,IDoctorTimeSlot,IScheduleDay} from '../../../models/DoctorTimeSlot.model'
import Appointment from "../../../models/Appointment.model";

const createTimeSlot = async (payload: any): Promise<any | null> => {
    const doctorId = payload.doctorId;

    try {
        // Check if the doctor exists
        const isDoctor = await Doctor.findById(doctorId);
        if (!isDoctor) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor account not found.');
        }

        // Check if a time slot already exists for the given day
        const isAlreadyExist = await DoctorTimeSlotModel.findOne({
            doctorId: isDoctor._id,
            day: payload.day
        });

        if (isAlreadyExist) {
            throw new ApiError(httpStatus.CONFLICT, 'Time slot already exists for the selected day. Please update or choose another day.');
        }

        // Create new DoctorTimeSlotModel with unique _id for each timeSlot
        const timeSlots = payload.timeSlot.map((item: any) => ({
            _id: new mongoose.Types.ObjectId(), // Generate unique _id
            startTime: item.startTime,
            endTime: item.endTime
        }));

        const newTimeSlot = new DoctorTimeSlotModel({
            day: payload.day,
            doctorId: isDoctor._id,
            maximumPatient: 10,  // Changed to a number
            weekDay: payload.day,
            timeSlot: timeSlots
        });

        // Save the new DoctorTimeSlotModel
        await newTimeSlot.save();

        if (!Array.isArray(newTimeSlot.timeSlot)) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Time slots data structure is invalid.');
        }

        // Create corresponding ScheduleDayModel entries with matching _id
        const scheduleDayPromises = newTimeSlot.timeSlot.map((item: any) => {
            const scheduleDay = new ScheduleDayModel({
                _id: item._id, // Ensure the _id matches
                startTime: item.startTime,
                endTime: item.endTime,
                doctorTimeSlotId: newTimeSlot._id  // Use the _id from DoctorTimeSlotModel
            });
            return scheduleDay.save();
        });

        // Await all ScheduleDayModel saves
        await Promise.all(scheduleDayPromises);

        console.log("Created time slot: ", newTimeSlot);

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


// const deleteTimeSlot = async (id: string): Promise<any | null> => {
//     try {
        
//         const deleteSchedule = await ScheduleDayModel.findById(id);
//         console.log("deleteSchedule: ", deleteSchedule)
//         let deleteScheduleDoctorId;
//         let result;

//         if (deleteSchedule) {
            
//             deleteScheduleDoctorId = deleteSchedule.doctorTimeSlotId;

          
//             const testDelete = await ScheduleDayModel.findByIdAndDelete(id);
// console.log("test delete:",testDelete)
          
//             result = await DoctorTimeSlotModel.findById(deleteScheduleDoctorId);
//             console.log("test reuslt: ", result)

//             if (result) {
//                 const slotTimeItems= result.timeSlot;
//                 if(slotTimeItems.length > 0) {
//                     for (const item of slotTimeItems) {
//                         if(item._id === id){
//                             await DoctorTimeSlotModel.findByIdAndDelete(timeSlot : id)
//                         }
//                     }
//                 }
                
//             }
//         } else {
//             console.log("Schedule day model not found!");
//         }
//         return result;
//     } catch (error) {
//         console.error("Failed to delete time slot:", error);
//         return null;
//     }
// };


const deleteTimeSlot = async (id: string): Promise<any | null> => {
    try {
       
        const deleteSchedule = await ScheduleDayModel.findById(id);
        // console.log("deleteSchedule: ", deleteSchedule);

        if (!deleteSchedule) {
            // console.log("Schedule day model not found!");
            return null;
        }

        const deleteScheduleDoctorId = deleteSchedule.doctorTimeSlotId;

        const testDelete = await ScheduleDayModel.findByIdAndDelete(id);
        console.log("test delete:", testDelete);

    
        const result = await DoctorTimeSlotModel.findById(deleteScheduleDoctorId);
        // console.log("test result: ", result);

        if (!result) {
            // console.log("DoctorTimeSlot model not found!");
            return null;
        }

    
        if (result.timeSlot) {
         
            const updatedTimeSlots = result.timeSlot.filter(item => item._id.toString() !== id);

        
            result.timeSlot = updatedTimeSlots;

           
            await result.save();

            
            if (result.timeSlot.length < 1) {
                await DoctorTimeSlotModel.findByIdAndDelete(deleteScheduleDoctorId);
                // console.log(`Deleted DoctorTimeSlotModel with id ${deleteScheduleDoctorId}`);
            }
        } else {
            console.log("Time slot array is not defined in DoctorTimeSlotModel!");
        }

        return result;
    } catch (error) {
        // console.error("Failed to delete time slot:", error);
        return null;
    }
};
const getTimeSlot = async (id: string): Promise<IDoctorTimeSlot[] | null> => {
    const result = await DoctorTimeSlotModel.find({doctorId: id}).populate('timeSlot');
    // console.log("result:  ", result);
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

    const result = await DoctorTimeSlotModel.find(conditions)
    .select('_id')
    .populate({
        path: 'timeSlot',
        select: '_id' // Chọn các trường bạn muốn lấy
    });
    return result;
}

const getAllTimeSlot = async (): Promise<IDoctorTimeSlot[] | null> => {
    const result = await DoctorTimeSlotModel.find().populate('timeSlot').populate({
        path: 'doctorId',
        select: 'firstName lastName'
    });
    return result;
}
// mongoose.set('debug', true);

const updateTimeSlot = async (payload: any): Promise<{ message: string }> => {
    const doctorId = payload.doctorId;
    // Check if the doctor exists
    const isDoctor = await Doctor.findById(doctorId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    const create = payload.create;
    const timeSlot = payload.timeSlot;

    if (create && create.length > 0) {
        const doctorTimeSlotId = create[0].doctorTimeSlotId;
        const doctorTimeSlot = await DoctorTimeSlotModel.findById(doctorTimeSlotId);

        if (!doctorTimeSlot) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Time Slot is not found !!');
        }

        for (const item of create) {
            const newScheduleDay = new ScheduleDayModel({
                startTime: item.startTime,
                endTime: item.endTime,
                doctorTimeSlotId: doctorTimeSlot._id
            });
            await newScheduleDay.save();

            // Add the new schedule day to the DoctorTimeSlotModel
            await DoctorTimeSlotModel.updateOne(
                { _id: doctorTimeSlotId },
                { $push: { timeSlot: newScheduleDay } } // Push the entire document
            );
        }
    }

    if (timeSlot && timeSlot.length > 0) {
        try {
            await Promise.all(timeSlot.map(async (item) => {
                // console.log("time slot: ", item);
                // Debugging: Log the item ID
                // console.log(`Updating ScheduleDay with ID: ${item._id}`);
    
                // Check if the ScheduleDay with the given ID exists
                const existingScheduleDay = await ScheduleDayModel.findById(item._id);
                if (!existingScheduleDay) {
                    throw new ApiError(httpStatus.NOT_FOUND, `Schedule Day with ID ${item._id} not found!`);
                }
    
                // Update ScheduleDayModel
                const updatedScheduleDay = await ScheduleDayModel.updateOne(
                    { _id: item._id },
                    {
                        $set: {
                            startTime: item.startTime,
                            endTime: item.endTime
                        }
                    }
                );
    
                // if (updatedScheduleDay.modifiedCount === 0) {
                //     throw new ApiError(httpStatus.NOT_FOUND, `Failed to update Schedule Day with ID ${item._id}`);
                // }
    
                // Update DoctorTimeSlotModel
                const updatedDoctorTimeSlot = await DoctorTimeSlotModel.updateOne(
                    { _id: item.doctorTimeSlotId, 'timeSlot._id': item._id },
                    {
                        $set: {
                            'timeSlot.$.startTime': item.startTime,
                            'timeSlot.$.endTime': item.endTime
                        }
                    }
                );
    
                // if (updatedDoctorTimeSlot.modifiedCount === 0) {
                //     throw new ApiError(httpStatus.NOT_FOUND, `Doctor Time Slot with ID ${item.doctorTimeSlotId} not found or Time Slot ID ${item._id} not found in the time slot array!`);
                // }
            }));
        } catch (error) {
            console.error(error);
            // Handle the error appropriately here, e.g., rethrow it or send a response
            throw error;
        }
    }

    return { message: 'Successfully Updated' };
};

const getAppointmentTimeOfEachDoctor = async (id: string, filter: any): Promise<any> => {
    const doctorTimeSlots = await DoctorTimeSlotModel.find({ doctorId: id }).populate('timeSlot');

    // Thêm debug để kiểm tra id và filter.day
    console.log("Doctor ID:", id);
    console.log("Filter Day:", filter.day);

    // Kiểm tra xem filter.day có hợp lệ không
    if (!filter.day) {
        console.error("Filter Day is missing or invalid.");
        return [];
    }

    // Chuyển đổi filter.day nếu nó là một ngày trong tuần
    let filterDayFormatted;
    if (moment(filter.day, 'dddd', true).isValid()) {
        filterDayFormatted = moment().day(filter.day).format('YYYY-MM-DD');
    } else {
        filterDayFormatted = moment(filter.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }

    if (filterDayFormatted === 'Invalid date') {
        console.error("Filter Day is not in a valid format.");
        return [];
    }
    console.log("Formatted Filter Day:", filterDayFormatted);

    // Lấy danh sách các time slot đã được booking
    const bookings = await Appointment.find({ doctorId: id, scheduleDate: { $regex: `^${filterDayFormatted}` } }).select('scheduleTime');

    // Thêm debug để kiểm tra truy vấn MongoDB
    console.log("MongoDB Query:", { doctorId: id, scheduleDate: { $regex: `^${filterDayFormatted}` } });

    const bookedTimeSlots = bookings.map(booking => booking.scheduleTime);

    // Thêm debug để kiểm tra bookings và bookedTimeSlots
    console.log("Bookings:", bookings);
    console.log("Booked Time Slots:", bookedTimeSlots);

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
                console.log("Start Date:", startDate.format('hh:mm a'));
                console.log("End Date:", endDate.format('hh:mm a'));

                while (startDate < endDate) {
                    const selectableTime = {
                        id: newTimeSlots.length + 1,
                        time: startDate.format('hh:mm a'), 
                        disabled: bookedTimeSlots.includes(startDate.format('hh:mm a'))
                    };
                    console.log("Selectable Time:", selectableTime);
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


// const getAppointmentTimeOfEachDoctor = async (id: string, filter: any): Promise<any> => {
//     const doctorTimeSlots = await DoctorTimeSlotModel.find({ doctorId: id }).populate('timeSlot');

//     const allSlots = doctorTimeSlots.map((item) => ({
//         day: item.day,
//         timeSlot: item.timeSlot
//     }));

//     const generateTimeSlot = (timeSlot: any) => {
//         const selectedTime: any[] = [];
//         timeSlot.forEach((item: any) => {
//             const interval = 30;
//             const newTimeSlots: any[] = [];
//             const day: string = item?.day;

//             item?.timeSlot.forEach((slot: IScheduleDay) => {
//                 const startDate = moment(slot.startTime, 'hh:mm a');
//                 const endDate = moment(slot.endTime, 'hh:mm a');

//                 while (startDate < endDate) {
//                     const selectableTime = {
//                         id: newTimeSlots.length + 1,
//                         time: startDate.format('hh:mm a')
//                     };
//                     newTimeSlots.push({ day, slot: selectableTime });
//                     startDate.add(interval, 'minutes');
//                 }
//             });

//             if (filter.day) {
//                 const newTime = newTimeSlots.filter((item) => item.day === filter.day);
//                 selectedTime.push(...newTime);
//             } else {
//                 selectedTime.push(...newTimeSlots);
//             }
//         });

//         return selectedTime;
//     };

//     return generateTimeSlot(allSlots);
// }

export const TimeSlotService = {
    updateTimeSlot,
    getAllTimeSlot,
    getTimeSlot,
    createTimeSlot,
    deleteTimeSlot,
    getMyTimeSlot,
    getAppointmentTimeOfEachDoctor
}