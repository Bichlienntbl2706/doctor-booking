import Medicine, {IMedicine } from '../../../models/Medicine.model';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const createMedicine = async (payload: IMedicine[]): Promise<{ message: string }> => {
    try {
        const createMedicinePromise = payload.map(async (medicine: IMedicine) => {
            await Medicine.create({
                dosage: medicine.dosage,
                duration: medicine.duration,
                frequency: medicine.frequency,
                medicine: medicine.medicine,
                prescriptionId: medicine.prescriptionId
            });
        });
        await Promise.all(createMedicinePromise);
        return {
            message: 'Successfully medicine added'
        };
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create medicine');
    }
};

const updateMedicine = async (payload: any): Promise<any | null> => {
    try {
        console.log("update medicine: ", payload);

        // Verify prescriptionId
        const isPrescriptionId = await Medicine.find();
        console.log("prescriptionId: ", isPrescriptionId);
        if (!isPrescriptionId) {
            console.log('Prescription not found with ID:', payload.prescriptionId);
            throw new ApiError(httpStatus.NOT_FOUND, 'Prescription is not found !!');
        }

        // Log duration before updating
        console.log('Updating with id:', payload._id);

        // Update medicine
        const result = await Medicine.findByIdAndUpdate(payload._id, {
            dosage: payload.dosage,
            duration: payload.duration,
            frequency: payload.frequency,
            medicine: payload.medicine
        }, { new: true });

        if (!result) {
            console.log('Medicine not found with ID:', payload._id);
            throw new ApiError(httpStatus.NOT_FOUND, 'Medicine not found !!');
        }

        return result;
    } catch (error) {
        console.log('Error updating medicine:');
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update medicine');
    }
};
const deleteMedicine = async (id: string): Promise<IMedicine> => {
    try {
        const result = await Medicine.findByIdAndDelete(id);
        if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Medicine not found !!');
        }
        return result;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete medicine');
    }
};

export const MedicineService = {
    updateMedicine,
    createMedicine,
    deleteMedicine
};
