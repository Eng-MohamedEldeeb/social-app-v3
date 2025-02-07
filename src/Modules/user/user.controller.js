import { Router } from "express";
import * as userService from "./services/user.service.js";
import * as userSelection from "./user.select.js";
import * as userValidation from "./user.validation.js";
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";
import { validation } from "../../Utils/Validation/validation.js";
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

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
    options: { projection: userSelection.getProfile.projection },
  }),
  userService.getProfile
);

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
);

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
);

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
);
router.put("/profile/privacy", userService.privateProfile);
router.put("/profile/2-steps-verification", userService.twoStepsVerification);
router.put("/profile/change-password", userService.changePassword);
router.put("/profile/new-password", userService.confirmNewPassword);
router.put("/profile/change-email", userService.changeEmail);
router.put("/profile/confirm-new-email", userService.confirmNewEmail);

/**
 * @method DELETE
 * @link /user/profile
 * @description Delete Account either Forever or only Deacitvate it
 * @query /profile?action=permanently || deactivate
 **/
router.delete("/profile", userService.deleteProfile);

/**
 * @method POST
 * @link /user/follow
 * @description Follow User
 * @query /follow?user=userID
 **/
router.post("/follow", userService.followUser);

/**
 * @method DELETE
 * @link /user/unfollow
 * @description Unfollow User
 * @query /unfollow?user=userID
 **/
router.delete("/unfollow", userService.unfollowUser);

/**
 * @method POST
 * @link /user/block
 * @description Block User
 * @query /block?user=userID
 **/
router.post("/block", userService.blockUser);

/**
 * @method DELETE
 * @link /user/unblock
 * @description Unblock User
 * @query /unblock?user=userID
 **/
router.delete("/unblock", userService.unblockUser);

router.get("/:userId/profile", userService.getUserProfile);
router.get("/:userId/followers", userService.getUserFollowers);
router.get("/:userId/following", userService.getUserFollowing);

export default router;
