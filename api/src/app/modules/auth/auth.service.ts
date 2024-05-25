import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import moment from 'moment';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../../../errors/apiError';
import config from '../../../config';
import { JwtHelper } from '../../../helpers/jwtHelper';
import { EmailtTransporter } from '../../../helpers/emailTransporter';
import Auth from '../../../models/auth.model';
import Doctor from '../../../models/Doctor.model';
import Patient from '../../../models/Patient.model';
import ForgotPassword from '../../../models/ForgotPassword.model';

type ILoginResponse = {
    accessToken?: string;
    user: {}
}

const loginUser = async (user: any): Promise<ILoginResponse> => {
    const { email: IEmail, password } = user;
    const isUserExist = await Auth.findOne({ email: IEmail });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
    }

    if (isUserExist.role === 'doctor') {
        const getDoctorInfo = await Doctor.findOne({ email: isUserExist.email });
        if (getDoctorInfo && getDoctorInfo.verified === false) {
            throw new ApiError(httpStatus.NOT_FOUND, "Please verify your email first!");
        }
    }

    if (!password || !isUserExist.password) {
        throw new ApiError(httpStatus.NOT_FOUND, "Password is not matched!");
    }

    const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);

    if (!isPasswordMatched) {
        throw new ApiError(httpStatus.NOT_FOUND, "Password is not matched!");
    }

    const { role, _id: userId } = isUserExist;
    const accessToken = JwtHelper.createToken(
        { role, userId },
        config.jwt.secret as string,
        config.jwt.JWT_EXPIRES_IN as string
    );

    return { accessToken, user: { role, userId } };
};

const VerificationUser = async (user: any): Promise<ILoginResponse> => {
    const { email: IEmail, password } = user;
    const isUserExist = await Auth.findOne({ email: IEmail });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
    }

    if (!password || !isUserExist.password) {
        throw new ApiError(httpStatus.NOT_FOUND, "Password is not matched!");
    }

    const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);

    if (!isPasswordMatched) {
        throw new ApiError(httpStatus.NOT_FOUND, "Password is not matched!");
    }

    const { role, _id: userId } = isUserExist;
    const accessToken = JwtHelper.createToken(
        { role, userId },
        config.jwt.secret as string,
        config.jwt.JWT_EXPIRES_IN as string
    );

    return { accessToken, user: { role, userId } };
};

const resetPassword = async (payload: any): Promise<{ message: string }> => {
    const { email } = payload;
    const isUserExist = await Auth.findOne({ email });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
    }

    const clientUrl = `${config.clientUrl}/reset-password/`;
    const uniqueString = uuidv4() + isUserExist._id;
    const uniqueStringHashed = await bcrypt.hash(uniqueString, 12);
    const encodedUniqueStringHashed = uniqueStringHashed.replace(/\//g, '-');

    const resetLink = clientUrl + isUserExist._id + '/' + encodedUniqueStringHashed;
    const currentTime = moment();
    const expiresTime = moment(currentTime).add(4, 'hours');

    const existingForgotPassword = await ForgotPassword.findOne({ userId: isUserExist._id });
    if (existingForgotPassword) {
        await ForgotPassword.deleteOne({ userId: isUserExist._id });
    }

    const forgotPassword = await ForgotPassword.create({
        userId: isUserExist._id,
        expiresAt: expiresTime.toDate(),
        uniqueString: resetLink
    });

    const pathName = path.join(__dirname, '../../../../template/resetPassword.html');
    const obj = { link: resetLink };
    const subject = "Request to Reset Password";
    const toMail: string = isUserExist.email ? isUserExist.email : 'bichlien.27062002.com';

    try {
        await EmailtTransporter({ pathName, replacementObj: obj, toMail, subject });
    } catch (error) {
        console.error("Error sending reset password email", error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable to send reset email!");
    }

    return { message: "Password reset successfully!" };
};

const PasswordResetConfirm = async (payload: any): Promise<{ message: string }> => {
    const { userId, uniqueString, password } = payload;

    await mongoose.connection.transaction(async (session) => {
        const isUserExist = await Auth.findById(userId).session(session);

        if (!isUserExist) {
            throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
        }

        const resetLink = `${config.clientUrl}/reset-password/${isUserExist._id}/${uniqueString}`;
        const getForgotRequest = await ForgotPassword.findOne({
            userId,
            uniqueString: resetLink
        }).session(session);

        if (!getForgotRequest) {
            throw new ApiError(httpStatus.NOT_FOUND, "Forgot request was not found or is invalid!");
        }

        const expiresAt = moment(getForgotRequest.expiresAt);
        const currentTime = moment();
        if (expiresAt.isBefore(currentTime)) {
            throw new ApiError(httpStatus.NOT_FOUND, "Forgot request has expired!");
        }

        if (password) {
            isUserExist.password = await bcrypt.hash(password, 12);
            await isUserExist.save({ session });
        }

        await ForgotPassword.deleteOne({ _id: getForgotRequest._id }).session(session);
    });

    return { message: "Password changed successfully!" };
};

export const AuthService = {
    loginUser,
    VerificationUser,
    resetPassword,
    PasswordResetConfirm
};