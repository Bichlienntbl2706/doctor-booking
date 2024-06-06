// import {Patient} from '../../../models/Patient.model';
import Auth from '../../../models/auth.model';
import bcrypt from 'bcrypt';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import Patient from '../../../models/Patient.model'

export const create = async (payload: any): Promise<any> => {
    try {
        const { password, ...othersData } = payload;

        // Check if email already exists
        const existEmail = await Auth.findOne({ email: payload.email });
        if (existEmail) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email Already Exists !!');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create patient and authentication entry
        const patient = await Patient.create(othersData);
        const authPayload = {
            email: payload.email,
            password: hashedPassword,
            role: 'patient',
            userId: payload.userId // Assuming userId is a reference to patient's _id
        };
        const auth = await Auth.create(authPayload);

        return { patient, auth };
    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
};

