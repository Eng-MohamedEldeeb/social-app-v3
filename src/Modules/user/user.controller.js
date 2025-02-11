import { Router } from "express";
import * as userService from "./services/user.service.js";
import * as userSelection from "./user.select.js";
import * as userValidation from "./user.validation.js";
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";
import { validation } from "../../Utils/Validation/validation.js";
import { userAuthentication } from "../../Middlewares/user/userAuthentication.js";
import profileRouter from "./../profile/profile.controller.js";

const router = Router();

router.use("/profile", profileRouter);

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

export default router;
