import mongoose, { Document, Schema } from 'mongoose';

export interface IScheduleDay extends Document {
    startTime?: string;
    endTime?: string;
    doctorTimeSlotId: mongoose.Types.ObjectId;
}

export interface IDoctorTimeSlot extends Document {
    day?: string;
    doctorId: mongoose.Types.ObjectId;
    maximumPatient?: number;
    weekDay?: string;
    timeSlot?: IScheduleDay[];
}

const scheduleDaySchema = new Schema({
    startTime: String,
    endTime: String,
    doctorTimeSlotId: { type: Schema.Types.ObjectId, ref: 'DoctorTimeSlot' }
});
const doctorTimeSlotSchema = new Schema({
    day: String,
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    maximumPatient: Number,
    weekDay: String,
    timeSlot: [scheduleDaySchema]
});

const ScheduleDayModel = mongoose.model<IScheduleDay>('ScheduleDay', scheduleDaySchema);
const DoctorTimeSlotModel = mongoose.model<IDoctorTimeSlot>('DoctorTimeSlot', doctorTimeSlotSchema);

export {ScheduleDayModel,DoctorTimeSlotModel}