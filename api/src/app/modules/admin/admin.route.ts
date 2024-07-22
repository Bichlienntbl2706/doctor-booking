import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "../admin/admin.controller";
import { PatientController } from "../patient/patient.controller"; // Import PatientController
import { DoctorController } from "../doctor/doctor.controller";
import { AppointmentController } from "../appointment/appointment.controller";
import { CloudinaryHelper } from "../../../helpers/uploadHelper";
import { AuthUser } from "../../../enums";
import { auth } from "../../middlewares/auth";
import { PrescriptionController } from "../prescription/prescription.controller";
import { AuthController } from "../auth/auth.controller";

const router = express.Router();

router.post("/create", AdminController.createAdmin);
router.get("/", AdminController.getAllAdmins);
router.get("/:id", AdminController.getAdmin);
router.patch(
    "/:id",
    CloudinaryHelper.upload.single("file"),
    auth(AuthUser.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
      return AdminController.updateAdmin(req, res, next);
    }
  );
router.delete("/:id", AdminController.deleteAdmin);
router.post("/block/patient/:id", AdminController.blockPatient);
router.post("/unblock/patient/:id", AdminController.unblockPatient);
router.post("/block/doctor/:id", AdminController.blockDoctor);
router.post("/unblock/doctor/:id", AdminController.unblockDoctor);

// Add routes for patient operations
router.post("/patient", PatientController.createPatient);
router.get("/patient", PatientController.getAllPatients);
router.get("/patient/:id", PatientController.getPatient);
router.patch("/patient/:id", PatientController.updatePatient);
router.delete("/patient/:id", PatientController.deletePatient);

// Add routes for doctor
router.get("/doctor", DoctorController.getAllDoctors);
router.post("/doctor", DoctorController.createDoctor);
router.get("/doctor/:id", DoctorController.getDoctor);
router.patch("/doctor/:id", DoctorController.updateDoctor);
router.delete("/doctor/:id", DoctorController.deleteDoctor);

// Add routes for doctor


//Add app
router.get("/appointment/doctor/appointments", AppointmentController.getDoctorAppointmentsById);
//Add invoice
router.get('/invoices', AppointmentController.getInvoices)
router.get('appointment/patient-payment-info/:id',auth(AuthUser.PATIENT, AuthUser.DOCTOR, AuthUser.ADMIN), AppointmentController.getPaymentInfoViaAppintmentId);

//Change pasword

router.patch('auth/change-password', AuthController.changePassword);

//Add routes for prescription
router.get('/prescription', PrescriptionController.getAllPrescriptions);
router.get("/prescription/:id", PrescriptionController.getPrescriptionById);
export const AdminRouter = router;

