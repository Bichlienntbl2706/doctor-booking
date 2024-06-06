import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.get('/user/verify/:userId/:uniqueString', AuthController.VerifyUser);
router.get('/verified', AuthController.Verified);
router.post('/login', AuthController.Login);
router.post('/reset-password', AuthController.resetPassword);
router.post('/reset-password/confirm', AuthController.PasswordResetConfirm);
router.get('/expired/link', AuthController.VerficationExpired);

export const AuthRouter = router;