// Routers :
import { Router } from "express";

// Services :

import {
  getProfile,
  getProfileFollowers,
  getProfileFollowing,
} from "./services/getProfile.service.js";
import { togglePrivateProfile } from "./services/privateProfile.service.js";
import { twoStepsVerification } from "./services/twoStepsVerification.service.js";
import {
  confirmNewEmail,
  updateProfile,
} from "./services/updateProfile.service.js";
import {
  changePassword,
  confirmNewPassword,
} from "./services/changePassword.service.js";

// Selections :
import * as profileSelection from "./profile.select.js";

// Validations :
import * as profileValidation from "./profile.validation.js";
import { validation } from "../../Utils/Validation/validation.js";
import { validateOTP } from "../../Middlewares/auth/validateOTP.js";
import { otpTypes } from "../../DB/Models/OTP/Validation/OTP.validation.js";

// Files :
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Authorizations :
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";

const router = Router();

/**
 * @method GET
 * @link /user/profile
 * @description Get User's Own Profile
 **/
router.get(
  "/",
  isAuthorized,
  isAuthenticated({
    select: profileSelection.getProfile.select,
    options: profileSelection.getProfile.options,
  }),
  getProfile
); //✅

/**
 * @method GET
 * @link /user/profile/followers
 * @description Get User's Own Followers
 **/
router.get(
  "/followers",
  isAuthorized,
  isAuthenticated({
    select: profileSelection.getProfileFollowers.select,
  }),
  getProfileFollowers
); //✅

/**
 * @method GET
 * @link /user/profile/following
 * @description Get User's Own Following
 **/
router.get(
  "/following",
  isAuthorized,
  isAuthenticated({
    select: profileSelection.getProfileFollowing.select,
  }),
  getProfileFollowing
); //✅

/**
 * @method PATCH
 * @link /user/profile/edit
 * @description Edit User's Own Profile
 **/
router.patch(
  "/edit",
  fileReader({ fileType: fileTypes.img }).single("avatar"),
  validation({
    schema: profileValidation.updateProfile,
    token: "authorization",
  }),
  isAuthorized,
  isAuthenticated({
    select: profileSelection.updateProfile.select,
  }),
  updateProfile
); //✅

/**
 * @method PATCH
 * @link /user/profile/privacy
 * @description Change User's Own Profile Privacy
 **/
router.put(
  "/privacy",
  isAuthorized,
  isAuthenticated({
    select: profileSelection.togglePrivateProfile.select,
  }),
  togglePrivateProfile
); //✅

/**
 * @method PUT
 * @link /user/profile/confirm-new-email
 * @description Confirm User's New E-mail
 **/

router.put(
  "/confirm-new-email",
  validation({
    schema: profileValidation.confirmNewEmail,
    otp: "confirmation-code",
  }),
  isAuthorized,
  isAuthenticated({
    select: profileSelection.confirmNewEmail.select,
  }),
  validateOTP({
    otpType: otpTypes.verifyEmail,
    otpFieldName: "confirmation-code",
  }),
  confirmNewEmail
); //✅

/**
 * @method Post
 * @link /user/profile/change-password
 * @description request Change Password Confirmation
 **/
router.post(
  "/change-password",
  isAuthorized,
  isAuthenticated({
    select: profileSelection.changePassword.select,
  }),
  changePassword
); //✅

/**
 * @method PUT
 * @link /user/profile/change-password
 * @description request Change Password Confirmation
 **/
router.put(
  "/new-password",
  validation({
    schema: profileValidation.confirmNewPassword,
    otp: "confirmation-code",
  }),
  isAuthorized,
  isAuthenticated({
    select: profileSelection.confirmNewPassword.select,
  }),
  confirmNewPassword
); //✅

/**
 * @method PUT
 * @link /user/profile/2-steps-verification
 * @description Add 2 Steps Verification
 **/
router.put(
  "/2-steps-verification",
  validation({
    schema: profileValidation.confirmNewEmail,
  }),
  isAuthorized,
  isAuthenticated({
    // select: profileSelection.twoStepsVerification.select,
  }),
  twoStepsVerification
);
export default router;
