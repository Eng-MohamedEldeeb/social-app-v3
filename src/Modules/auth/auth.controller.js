// Router :
import { Router } from "express";

// Services :
import { confirmEmail } from "./service/confirmEmail.service.js";
import { register } from "./service/register.service.js";
import { login } from "./service/login.service.js";
import { forgotPassword } from "./service/forgotPassword.service.js";
import { resetPassword } from "./service/resetPassword.service.js";

// Selection :
import * as authSelection from "./auth.select.js";

// Validators :
import * as authValidators from "./auth.validation.js";
import { isExisted } from "../../Middlewares/auth/isExisted.js";
import { validation } from "../../Utils/Validation/validation.js";
import { validateOTP } from "../../Middlewares/auth/validateOTP.js";
import { otpTypes } from "../../DB/Models/OTP/Validation/OTP.validation.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";

// Files :
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

const router = Router();

/**
 * @method POST
 * @link /auth/confirm-email
 * @description Send Confirmation E-email To User To Procced a Safety Registeration
 **/
router.post(
  "/confirm-email",
  validation({ schema: authValidators.confirmEmail, token: false }),
  isExisted({ options: { projection: authSelection.confirmEmail.projection } }),
  confirmEmail
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
    schema: authValidators.register,
    otp: "confirmation-code",
    token: false,
  }),
  validateOTP({
    otpType: otpTypes.confirmation,
    otpFieldName: "confirmation-code",
  }),
  register
);

/**
 * @method POST
 * @link /auth/Login
 * @description Login and Respones With Access & Refresh Token
 **/
router.post(
  "/login",
  validation({ schema: authValidators.login, token: false }),
  login
);

/**
 * @method POST
 * @link /auth/forgot-password
 * @description Send E-mail to User With Confirmation Code To Procced a Safety Changing Password
 **/
router.post(
  "/forgot-password",
  validation({ schema: authValidators.forgotPassword, token: false }),
  isAuthenticated({
    options: { projection: authSelection.resetPassword.projection },
  }),
  forgotPassword
);

/**
 * @method PUT
 * @link /auth/reset-password
 * @description Procced Changing Password
 **/
router.put(
  "/reset-password",
  validation({
    schema: authValidators.resetPassword,
    otp: "confirmation-code",
    token: false,
  }),
  validateOTP({
    otpType: otpTypes.resetPassword,
    otpFieldName: "confirmation-code",
  }),
  isAuthenticated({
    options: { projection: authSelection.resetPassword.projection },
  }),
  resetPassword
);

export default router;
