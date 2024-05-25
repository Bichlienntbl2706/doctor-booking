import {Medicine, IMedicine } from '../../../models/Medicine.model';
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

const updateMedicine = async (payload: IMedicine): Promise<IMedicine> => {
    try {
        const isPrescriptionId = await Medicine.findById(payload.prescriptionId);
        if (!isPrescriptionId) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Prescription is not found !!');
        }

        const result = await Medicine.findByIdAndUpdate(payload.id, {
            dosage: payload.dosage,
            duration: payload.duration,
            frequency: payload.frequency,
            medicine: payload.medicine
        }, { new: true });

        if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Medicine not found !!');
        }

        return result;
    } catch (error) {
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
