import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import Prescription,{IPrescription} from '../../../models/Prescription.model'
import Doctor from '../../../models/Doctor.model'
import Appointment from '../../../models/Appointment.model'
import Medicine from '../../../models/Medicine.model'
import Patient from '../../../models/Patient.model'


const createPrescription = async (user: any, payload: any): Promise<{ message: string }> => {
    const { medicine, ...others } = payload;
    const { doctorId } = user;

    const isDoctor = await Doctor.findById(doctorId);
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
    }

    const isAppointment = await Appointment.findById(payload.appointmentId);
    if (!isAppointment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Appointment is not found !!');
    }
    
    if (payload.status === 'Completed') {
        await Appointment.findByIdAndUpdate(isAppointment._id, {
            prescriptionStatus: 'issued'
        });
    }

    await Appointment.findByIdAndUpdate(isAppointment._id, {
        status: payload.status,
        patientType: payload.patientType,
    });

    const prescription = await Prescription.create({
        ...others,
        doctorId: isDoctor.id,
        patientId: isAppointment.patientId,
        appointmentId: isAppointment._id,
        medicines: []
    });

    try {
        const medicinePromises = payload.medicine.map(async (med: any) => {
            const createdMedicine = await Medicine.create({
                ...med,
                prescriptionId: prescription.id
            });
            return createdMedicine;
        });

        const medicines = await Promise.all(medicinePromises);
        
        const medicineIds = medicines.map(med => med.id);
        prescription.medicines = medicineIds;
        await prescription.save();
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating medicines');
    }

    // Update the appointment with the prescription ID
    try {
        const appointmentUpdateResult = await Appointment.findByIdAndUpdate(isAppointment._id, {
            prescriptionId: prescription._id
        });
        console.log("Appointment Update Result with prescriptionId:", appointmentUpdateResult);
    } catch (error) {
        console.error('Error updating appointment with prescription ID:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating appointment with prescription ID');
    }

    return { message: "Successfully Prescription Created" };
}


const updatePrescriptionAndAppointment = async (user: any, payload: any): Promise<{ message: string }> => {
    const { status, patientType, followUpdate, prescriptionId, diagnosis, medicine, ...others } = payload;
    const { doctorId } = user;

    try {
        // Check if the doctor exists
        const isDoctor = await Doctor.findById(doctorId);
        if (!isDoctor) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
        }

        // Check if the prescription exists
        const isPrescribed = await Prescription.findById(prescriptionId);
        if (!isPrescribed) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Prescription is not found !!');
        }

        // Update the appointment with follow-up status, status, and patient type
        await Appointment.updateOne({
            _id: isPrescribed.appointmentId
        }, {
            isFollowUp: followUpdate ? true : false,
            status: status,
            patientType: patientType,
        });

        // Update the prescription with diagnosis and other details
        await Prescription.updateOne({
            _id: prescriptionId
        }, {
            diagnosis: diagnosis,
            ...others,
        });

        // Fetch the updated prescription to get the updated prescriptionId
        const updatedPrescription = await Prescription.findById(prescriptionId);
        if (!updatedPrescription) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve the updated prescription.');
        }

        // Update the appointment with the updated prescriptionId
        await Appointment.updateOne({
            _id: isPrescribed.appointmentId
        }, {
            prescriptionId: updatedPrescription._id
        });

        // Update or create new medicines if medicine array is provided
        if (Array.isArray(medicine)) {
            try {
                // Create new medicines
                const medicinePromises = medicine.map(async (med: any) => {
                    const createdMedicine = await Medicine.create({
                        ...med,
                        prescriptionId: updatedPrescription._id
                    });
                    return createdMedicine._id; // Return the ID of the created medicine
                });
        
                const medicineIds = await Promise.all(medicinePromises);
        
                // Update the prescription with new medicines
                await Prescription.updateOne({
                    _id: prescriptionId
                }, {
                    $addToSet: { medicines: { $each: medicineIds } }
                });
        
            } catch (error) {
                console.error('Error updating medicines:', error);
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating medicines');
            }
        }

        return { message: "Successfully Prescription Updated" };
    } catch (error) {
        console.error('Error updating prescription and appointment:', error);
        throw error;
    }
}




// const updatePrescriptionAndAppointment = async (user: any, payload: any): Promise<{ message: string }> => {
//     const { status, patientType, prescriptionId, diagnosis, ...others } = payload;
//     const { doctorId } = user;

//     try {
//         // Check if the doctor exists
//         const isDoctor = await Doctor.findById(doctorId);
//         if (!isDoctor) {
//             throw new ApiError(httpStatus.NOT_FOUND, 'Doctor Account is not found !!');
//         }

//         // Check if the prescription exists
//         const isPrescribed = await Prescription.findById(prescriptionId);
//         if (!isPrescribed) {
//             throw new ApiError(httpStatus.NOT_FOUND, 'Prescription is not found !!');
//         }

//         // Update the appointment with follow-up status, status, and patient type
//         const appointmentUpdateResult = await Appointment.updateOne({
//             _id: isPrescribed.appointmentId
//         }, {
//             status: status,
//             patientType: patientType
//         });
//         // console.log("Appointment Update Result:", appointmentUpdateResult);

//         // Update the prescription with diagnosis and other details
//         const prescriptionUpdateResult = await Prescription.updateOne({
//             _id: prescriptionId
//         }, {
//             diagnosis: diagnosis,
//             ...others,
//         });
//         // console.log("Prescription Update Result:", prescriptionUpdateResult);

//         // Fetch the updated prescription to get the updated prescriptionId
//         const updatedPrescription = await Prescription.findById(prescriptionId);
//         // console.log("updatedPrescription", updatedPrescription);

//         if (!updatedPrescription) {
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve the updated prescription.');
//         }

//         // Debugging: Log values before updating appointment
//         // console.log("Appointment ID to update:", isPrescribed.appointmentId);
//         // console.log("New Prescription ID:", updatedPrescription._id);

//         // Update the appointment with the updated prescriptionId
//         const finalUpdateResult = await Appointment.updateOne({
//             _id: isPrescribed.appointmentId
//         }, {
//             prescriptionId: updatedPrescription._id
//         });

//         // Debugging: Log the result of the update operation
//         // console.log("Final Update Result:", finalUpdateResult);

//         if (finalUpdateResult.modifiedCount === 0) {
//             throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update the appointment with the new prescription ID.');
//         }

//         return { message: "Successfully Prescription Updated" };
//     } catch (error) {
//         console.error('Error updating prescription and appointment:', error);
//         throw error;
//     }
// }



const getAllPrescriptions = async (): Promise<IPrescription[] | null> => {
    try {
        const result = await Prescription.find().populate('appointmentId', 'trackingId');
        return result;
    } catch (error) {
        console.error('Error retrieving prescriptions:', error);
        return null;
    }
};

const getPrescriptionById = async (id: string): Promise<any | null> => {
    // console.log("id prescript: ", id);

    const medicines = await Medicine.find({prescriptionId:id});
    // console.log("medicine: ", medicines)
    
    const result = await Prescription.findById(id)
        .populate('appointmentId', 'scheduleDate scheduleTime status trackingId patientType description prescriptionStatus paymentStatus')
        .populate('doctorId', 'firstName lastName designation email college address country state specialization')
        .populate('patientId', 'firstName lastName gender dateOfBirth email bloodGroup address img city country weight mobile');

    
    if (result) {
        result.set('medicines', medicines, { strict: false });
    }

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