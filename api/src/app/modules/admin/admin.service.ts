import Admin, { IAdmin } from "../../../models/Admin.model";
import Patient from "../../../models/Patient.model";
import Auth from "../../../models/auth.model";
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { IUpload } from "../../../interfaces/file";
import { Request } from "express";
import { CloudinaryHelper } from "../../../helpers/uploadHelper";
import Doctor from "../../../models/Doctor.model";
import nodemailer from "nodemailer";
import Payment from "../../../models/Payment.model";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailNotification = async (
  email: string,
  action: "block" | "unblock",
  reason?: string
): Promise<void> => {
  try {
    let emailText = `Your account has been ${action === "block" ? "blocked" : "unblocked"}.`;
    if (action === "block" && reason) {
      emailText += `\n\nReason: ${reason}`;
    }

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: `Account ${action.charAt(0).toUpperCase() + action.slice(1)} Notification`,
      text: emailText,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    // Handle email sending error gracefully
  }
};

const blockEntity = async (
  model: any,
  entityId: string,
  reason: string
): Promise<void> => {
  try {
    console.log(`Updating ${model.modelName} with ID ${entityId} to block`);

    const entity = await model.findByIdAndUpdate(
      entityId,
      { isBlocked: true },
      { new: true }
    );

    if (!entity) {
      throw new ApiError(httpStatus.NOT_FOUND, `${model.modelName} not found`);
    }

    if (!entity.email) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `${model.modelName} email not found`
      );
    }

    console.log(
      `${model.modelName} with ID ${entityId} has been blocked. Email: ${entity.email}`
    );

    await sendEmailNotification(entity.email, "block", reason);
  } catch (error: any) {
    console.error(`Error blocking ${model.modelName.toLowerCase()}:`, error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const unblockEntity = async (model: any, entityId: string): Promise<void> => {
  try {
    console.log(`Updating ${model.modelName} with ID ${entityId} to unblock`);

    const entity = await model.findByIdAndUpdate(
      entityId,
      { isBlocked: false },
      { new: true }
    );

    if (!entity) {
      throw new ApiError(httpStatus.NOT_FOUND, `${model.modelName} not found`);
    }

    if (!entity.email) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `${model.modelName} email not found`
      );
    }

    console.log(
      `${model.modelName} with ID ${entityId} has been unblocked. Email: ${entity.email}`
    );

    await sendEmailNotification(entity.email, "unblock");
  } catch (error: any) {
    console.error(`Error unblocking ${model.modelName.toLowerCase()}:`, error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const blockDoctor = async (doctorId: string, reason: string): Promise<void> => {
  await blockEntity(Doctor, doctorId, reason);
};

const unblockDoctor = async (doctorId: string): Promise<void> => {
  await unblockEntity(Doctor, doctorId);
};

const blockPatient = async (
  patientId: string,
  reason: string
): Promise<void> => {
  await blockEntity(Patient, patientId, reason);
};

const unblockPatient = async (patientId: string): Promise<void> => {
  await unblockEntity(Patient, patientId);
};
const createAdmin = async (payload: any): Promise<any> => {
  try {
    const { password, ...othersData } = payload;

    // Check if email already exists
    const existEmail = await Auth.findOne({ email: payload.email });
    if (existEmail) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Email Already Exists !!"
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin and authentication entry
    const admin = await Admin.create(othersData);
    const authPayload = {
      email: payload.email,
      password: hashedPassword,
      role: "admin",
      userId: payload.userId, // Assuming userId is a reference to admin's _id
    };
    const auth = await Auth.create(authPayload);

    return { admin, auth };
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getAllAdmins = async (): Promise<IAdmin[] | null> => {
  const result = await Admin.find();
  return result;
};

const getAdmin = async (id: string): Promise<IAdmin | null> => {
  try {
    const result = await Admin.findById(id);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get admin");
  }
};

const deleteAdmin = async (id: string): Promise<any> => {
  try {
    await Admin.findByIdAndDelete(id);
    await Auth.findOneAndDelete({ email: id });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete admin"
    );
  }
};

const updateAdmin = async (req: Request): Promise<IAdmin | null> => {
  try {
    const file = req.file as IUpload;
    const id = req.params.id as string;
    const user = JSON.parse(req.body.data);

    if (file) {
      const uploadImage = await CloudinaryHelper.uploadFile(file);
      if (uploadImage) {
        user.img = uploadImage.secure_url;
      } else {
        throw new ApiError(
          httpStatus.EXPECTATION_FAILED,
          "Failed to update image !!"
        );
      }
    }

    const result = await Admin.findByIdAndUpdate(id, user, { new: true });
    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update admin"
    );
  }
};

export const AdminService = {
  createAdmin,
  updateAdmin,
  getAdmin,
  getAllAdmins,
  deleteAdmin,
  blockPatient,
  blockDoctor,
  unblockPatient,
  unblockDoctor,
};
