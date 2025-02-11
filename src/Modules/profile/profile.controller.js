import { Router } from "express";
import * as profileService from "./services/profile.service.js";
import * as profileSelection from "./profile.select.js";
import * as profileValidation from "./profile.validation.js";
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";
import { validation } from "../../Utils/Validation/validation.js";
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";
import { validateOTP } from "../../Middlewares/auth/validateOTP.js";
import { otpTypes } from "../../DB/Options/field.validation.js";

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
    options: {
      projection: profileSelection.getProfile.projection,
      populate: profileSelection.getProfile.populate,
    },
  }),
  profileService.getProfile
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
    options: { projection: profileSelection.getProfileFollowers.projection },
  }),
  profileService.getProfileFollowers
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
    options: { projection: profileSelection.getProfileFollowing.projection },
  }),
  profileService.getProfileFollowing
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
    options: { projection: profileSelection.togglePrivateProfile.projection },
  }),
  profileService.togglePrivateProfile
); //✅

/**
 * @method POST
 * @link /user/profile/delete-forever
 * @description Delete Account Forever
 **/
router.post(
  "/delete-forever",
  validation({
    schema: profileValidation.deleteProfile,
    token: "authorization",
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: profileSelection.deleteProfile.projection },
  }),
  profileService.deleteProfile
);

/**
 * @method DELETE
 * @link /user/profile
 * @description Delete Account Forever
 **/
router.delete(
  "/",
  isAuthorized,
  isAuthenticated({
    options: { projection: profileSelection.confirmDeleteProfile.projection },
  }),
  validation({
    schema: profileValidation.confirmDeleteProfile,
    token: "authorization",
    otp: "confirmation-code",
  }),
  profileService.confirmDeleteProfile
);

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
    options: { projection: profileSelection.confirmNewEmail.projection },
  }),
  profileService.twoStepsVerification
);
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
    options: { projection: profileSelection.updateProfile.projection },
  }),
  profileService.updateProfile
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
    options: { projection: profileSelection.confirmNewEmail.projection },
  }),
  validateOTP({
    otpType: otpTypes.confirmNewEmail,
    otpFieldName: "confirmation-code",
  }),
  profileService.confirmNewEmail
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
    options: { projection: profileSelection.changePassword.projection },
  }),
  profileService.changePassword
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
    options: { projection: profileSelection.confirmNewPassword.projection },
  }),
  profileService.confirmNewPassword
); //✅

export default router;
