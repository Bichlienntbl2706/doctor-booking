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
    day: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    maximumPatient: { type: Number, required: true },
    weekDay: { type: String, required: true },
    timeSlot: [scheduleDaySchema]
});

const ScheduleDayModel = mongoose.model<IScheduleDay>('ScheduleDay', scheduleDaySchema);
const DoctorTimeSlotModel = mongoose.model<IDoctorTimeSlot>('DoctorTimeSlot', doctorTimeSlotSchema);

export { ScheduleDayModel, DoctorTimeSlotModel };


// const DoctorTimeSlotSchema = new mongoose.Schema({
//     doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
//     day: { type: String, required: true },
//     maximumPatient: { type: Number, required: true },
//     weekDay: { type: String, required: true },
//     timeSlot: [{
//         startTime: { type: String, required: true },
//         endTime: { type: String, required: true }
//     }]
// });

// const DoctorTimeSlotModel = mongoose.model('DoctorTimeSlot', DoctorTimeSlotSchema);
