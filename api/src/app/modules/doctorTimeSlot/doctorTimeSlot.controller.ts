import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TimeSlotService } from "./doctorTimeSlot.service";
import { IDoctorTimeSlot } from "../../../models/DoctorTimeSlot.model";

const createTimeSlot = catchAsync(async (req: Request, res: Response) => {
    console.log("create time slot controller body: ", req.body);
    const result = await TimeSlotService.createTimeSlot( req.body);
   
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully created Time Slot !!',
        success: true,
        data: result
    });
});


const getAllTimeSlot = catchAsync(async (req: Request, res: Response) => {
    const result = await TimeSlotService.getAllTimeSlot();
    sendResponse<IDoctorTimeSlot[]>(res, {
        statusCode: 200,
        message: 'Successfully  get all Time Slot !!',
        success: true,
        data: result
    });
});

const getMyTimeSlot = catchAsync(async (req: Request, res: Response) => {
    const result = await TimeSlotService.getMyTimeSlot(req.user, req.query);
    sendResponse<IDoctorTimeSlot[]>(res, {
        statusCode: 200,
        message: 'Successfully  get all Time Slot !!',
        success: true,
        data: result
    });
});

const getTimeSlot = catchAsync(async (req: Request, res: Response) => {
    const result = await TimeSlotService.getTimeSlot(req.params.id);
    sendResponse<IDoctorTimeSlot>(res, {
        statusCode: 200,
        message: 'Successfully get Time Slot !!',
        success: true,
        data: result
    });
});

const updateTimeSlot = catchAsync(async (req: Request, res: Response) => {
    await TimeSlotService.updateTimeSlot(req.body);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully updated Time Slot !!',
        success: true,
    });
});

const deleteTimeSlot = catchAsync(async (req: Request, res: Response) => {
    const result = await TimeSlotService.deleteTimeSlot(req.params.id);
    sendResponse<IDoctorTimeSlot>(res, {
        statusCode: 200,
        message: 'Successfully deleted Time Slot !!',
        success: true,
        data: result
    });
});

const getAppointmentTimeOfEachDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await TimeSlotService.getAppointmentTimeOfEachDoctor(req.params.id, req.query);
    sendResponse<IDoctorTimeSlot>(res, {
        statusCode: 200,
        message: 'Successfully retrieved appointment times !!',
        success: true,
        data: result
    });
});

export const doctorTimeSlotController = {
    getAllTimeSlot,
    getTimeSlot,
    updateTimeSlot,
    createTimeSlot,
    deleteTimeSlot,
    getMyTimeSlot,
    getAppointmentTimeOfEachDoctor
};
