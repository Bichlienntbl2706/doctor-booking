import { Request, Response, NextFunction } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdminService } from "../Admin/admin.service";
import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import Doctor from "../../../models/Doctor.model";
import Payment from "../../../models/Payment.model";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createAdmin(req.body);
  sendResponse(res, {
    statusCode: 200,
    message: "Successfully Admin Created !!",
    success: true,
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmins();
  sendResponse(res, {
    statusCode: 200,
    message: "Successfully Get Admin !!",
    success: true,
    data: result,
  });
});

const getAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAdmin(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    message: "Successfully retrieved admin!",
    success: true,
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateAdmin(req);
  sendResponse(res, {
    statusCode: 200,
    message: "Successfully updated admin!",
    success: true,
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteAdmin(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    message: "Successfully Deleted Admin !!",
    success: true,
    data: result,
  });
});

const blockDoctor = async (req: Request, res: Response): Promise<void> => {
  const doctorId = req.params.id;
  const { reason } = req.body; // Nhận lý do từ body
  try {
    await AdminService.blockDoctor(doctorId, reason);
    res
      .status(200)
      .json({ success: true, message: "Doctor blocked successfully" });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

const unblockDoctor = async (req: Request, res: Response): Promise<void> => {
  const doctorId = req.params.id;
  try {
    await AdminService.unblockDoctor(doctorId);
    res
      .status(200)
      .json({ success: true, message: "Doctor unblocked successfully" });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

const blockPatient = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.params.id;
  const { reason } = req.body; // Nhận lý do từ body
  try {
    await AdminService.blockPatient(patientId, reason);
    res
      .status(200)
      .json({ success: true, message: "Patient blocked successfully" });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

const unblockPatient = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.params.id;
  try {
    await AdminService.unblockPatient(patientId);
    res
      .status(200)
      .json({ success: true, message: "Patient unblocked successfully" });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
};

export const AdminController = {
  createAdmin,
  getAdmin,
  updateAdmin,
  getAllAdmins,
  deleteAdmin,
  blockDoctor,
  blockPatient,
  unblockDoctor,
  unblockPatient,
};
