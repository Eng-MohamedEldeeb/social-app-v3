import { Router } from "express";
import * as authService from "./service/auth.service.js";
import * as authSelection from "./auth.select.js";
import { isExisted } from "../../Middlewares/auth/isExisted.js";
import * as authValidation from "./auth.validation.js";
import { validation } from "../../Utils/Validations/validation.js";
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";
import { validateOTP } from "../../Middlewares/auth/validateOTP.js";
import { otpTypes } from "../../DB/Options/field.validation.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";

const router = Router();

/**
 * @method POST
 * @link /auth/confirm-email
 * @description Send Confirmation E-email To User To Procced a Safety Registeration
 **/
router.post(
  "/confirm-email",
  validation({ schema: authValidation.confirmEmailSchema }),
  isExisted({ options: { projection: authSelection.confirmEmail.projection } }),
  authService.confirmEmail
);

/**
 * @method POST
 * @link /auth/register
 * @description Add User To Data-Base With Or Without Profile-Pic
 **/
router.post(
  "/register",
  fileReader({ fileType: fileTypes.img }).single("avatar"),
  validation({
    schema: authValidation.registerSchema,
    otp: "registeration",
  }),
  validateOTP({ otpType: otpTypes.confirmation, otpName: "registeration" }),
  authService.register
);

/**
 * @method POST
 * @link /auth/Login
 * @description Login and Respones With Access & Refresh Token
 **/
router.post(
  "/login",
  validation({ schema: authValidation.loginSchema }),
  authService.login
);

/**
 * @method POST
 * @link /auth/forgot-password
 * @description Send E-mail to User With Confirmation Code To Procced a Safety Changing Password
 **/
router.post(
  "/forgot-password",
  validation({ schema: authValidation.forgotPasswordSchema }),
  isAuthenticated({
    options: { projection: authSelection.resetPassword.projection },
  }),
  authService.forgotPassword
);

/**
 * @method PUT
 * @link /auth/reset-password
 * @description Procced Changing Password
 **/
router.put(
  "/reset-password",
  validation({
    schema: authValidation.resetPasswordSchema,
    otp: "reset-password",
  }),
  validateOTP({ otpType: otpTypes.resetPassword, otpName: "reset-password" }),
  isAuthenticated({
    options: { projection: authSelection.resetPassword.projection },
  }),
  authService.resetPassword
);

export default router;
