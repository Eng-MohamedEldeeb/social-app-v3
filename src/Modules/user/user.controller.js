import { Router } from "express";
import * as userService from "./services/user.service.js";
import * as userSelection from "./user.select.js";
import * as userValidation from "./user.validation.js";
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";
import { validation } from "../../Utils/Validation/validation.js";
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";
import { userAuthentication } from "../../Middlewares/user/userAuthentication.js";
import { validateOTP } from "../../Middlewares/auth/validateOTP.js";
import { otpTypes } from "../../DB/Options/field.validation.js";

const router = Router();

/**
 * @method GET
 * @link /user/profile
 * @description Get User's Own Profile
 **/
router.get(
  "/profile",
  isAuthorized,
  isAuthenticated({
    options: {
      projection: userSelection.getProfile.projection,
      populate: userSelection.getProfile.populate,
    },
  }),
  userService.getProfile
); //✅

/**
 * @method GET
 * @link /user/profile/followers
 * @description Get User's Own Followers
 **/
router.get(
  "/profile/followers",
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.getProfileFollowers.projection },
  }),
  userService.getProfileFollowers
); //✅

/**
 * @method GET
 * @link /user/profile/following
 * @description Get User's Own Following
 **/
router.get(
  "/profile/following",
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.getProfileFollowing.projection },
  }),
  userService.getProfileFollowing
); //✅

/**
 * @method GET
 * @link /user/profile/following
 * @description Get User's Own Following
 **/
router.get(
  "/:userID/profile",
  validation({ schema: userValidation.getUserProfile }),
  isAuthorized,
  isAuthenticated({
    options: {
      projection: userSelection.getUserProfile.projection.isAuthenticated,
    },
  }),
  userAuthentication({
    options: {
      projection: userSelection.getUserProfile.projection.userAuthentication,
    },
  }),
  userService.getUserProfile
); //✅

/**
 * @method GET
 * @link /user/profile/following
 * @description Get User's Own Following
 **/
router.get(
  "/:userID/followers",
  validation({ schema: userValidation.getUserFollowers }),
  isAuthorized,
  isAuthenticated({
    options: {
      projection: userSelection.getUserFollowers.projection.isAuthenticated,
    },
  }),
  userAuthentication({
    options: {
      projection: userSelection.getUserFollowers.projection.userAuthentication,
    },
  }),
  userService.getUserFollowers
); //✅

/**
 * @method GET
 * @link /user/profile/following
 * @description Get User's Own Following
 **/
router.get(
  "/:userID/following",
  validation({ schema: userValidation.getUserFollowing }),
  isAuthorized,
  isAuthenticated({
    options: {
      projection: userSelection.getUserFollowing.projection.isAuthenticated,
    },
  }),
  userAuthentication({
    options: {
      projection: userSelection.getUserFollowing.projection.userAuthentication,
    },
  }),
  userService.getUserFollowing
); //✅

/**
 * @method PATCH
 * @link /user/profile/edit
 * @description Edit User's Own Profile
 **/
router.patch(
  "/profile/edit",
  fileReader({ fileType: fileTypes.img }).single("avatar"),
  validation({
    schema: userValidation.updateProfile,
    token: "authorization",
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.updateProfile.projection },
  }),
  userService.updateProfile
); //✅

/**
 * @method PUT
 * @link /user/profile/confirm-new-email
 * @description Confirm User's New E-mail
 **/

router.put(
  "/profile/confirm-new-email",
  validation({
    schema: userValidation.confirmNewEmail,
    otp: "confirmation-code",
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.confirmNewEmail.projection },
  }),
  validateOTP({
    otpType: otpTypes.confirmNewEmail,
    otpFieldName: "confirmation-code",
  }),
  userService.confirmNewEmail
); //✅

/**
 * @method POST
 * @link /user/follow
 * @description Follow User
 * @param /follow/:userID
 **/
router.post(
  "/follow/:userID",
  validation({
    schema: userValidation.followUser,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.followUser.projection },
  }),
  userService.followUser
); //✅

/**
 * @method DELETE
 * @link /user/unfollow
 * @description Unfollow User
 * @param /unfollow/:userID
 **/
router.delete(
  "/unfollow/:userID",
  validation({
    schema: userValidation.unfollowUser,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.unfollowUser.projection },
  }),
  userService.unfollowUser
); //✅

/**
 * @method POST
 * @link /user/block
 * @description Block User
 * @param /block/:userID
 **/
router.post(
  "/block/:userID",
  validation({
    schema: userValidation.blockUser,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.blockUser.projection },
  }),
  userService.blockUser
); //✅

/**
 * @method DELETE
 * @link /user/unblock
 * @description Unblock User
 * @param /unblock/:userID
 **/
router.delete(
  "/unblock/:userID",
  validation({
    schema: userValidation.unblockUser,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.unblockUser.projection },
  }),
  userService.unblockUser
); //✅

/**
 * @method PATCH
 * @link /user/profile/privacy
 * @description Change User's Own Profile Privacy
 **/
router.put(
  "/profile/privacy",
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.togglePrivateProfile.projection },
  }),
  userService.togglePrivateProfile
); //✅

/**
 * @method DELETE
 * @link /user/profile
 * @description Delete Account either Forever or only Deacitvate it
 **/
router.delete(
  "/profile",
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.deleteProfile.projection },
  }),
  userService.deleteProfile
);

/**
 * @method PUT
 * @link /user/profile/2-steps-verification
 * @description Add 2 Steps Verification
 **/
router.put(
  "/profile/2-steps-verification",

  validation({
    schema: userValidation.confirmNewEmail,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.confirmNewEmail.projection },
  }),
  userService.twoStepsVerification
);

/**
 * @method Post
 * @link /user/profile/change-password
 * @description request Change Password Confirmation
 **/
router.post(
  "/profile/change-password",

  validation({
    schema: userValidation.confirmNewEmail,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.confirmNewEmail.projection },
  }),
  userService.changePassword
);

/**
 * @method PUT
 * @link /user/profile/change-password
 * @description request Change Password Confirmation
 **/
router.put(
  "/profile/new-password",

  validation({
    schema: userValidation.confirmNewEmail,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.confirmNewEmail.projection },
  }),
  userService.confirmNewPassword
);

export default router;
