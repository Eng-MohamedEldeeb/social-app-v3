// Routers :
import { Router } from "express";
import profileRouter from "./../profile/profile.controller.js";

// Services :
import { groupAuthentication } from "../../Middlewares/group/groupAuthentication.js";
import {
  getUserFollowers,
  getUserFollowing,
  getUserProfile,
} from "./services/getUserProfile.service.js";
import { followUser, unfollowUser } from "./services/userFollowing.service.js";
import { blockUser, unblockUser } from "./services/userBlocking.service.js";
import { groupJoin } from "./services/groupJoin.service.js";
import {
  confirmDeleteAccount,
  requestDeleteAccount,
} from "./services/requestDeleteAccount.service.js";
import { deactivateAccount } from "./services/deactivateAccount.service.js";

// Selections :
import * as userSelection from "./user.select.js";

// Validators :
import * as userValidation from "./user.validation.js";
import { validation } from "../../Utils/Validation/validation.js";

// Authorizations :
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";
import { userAuthentication } from "../../Middlewares/user/userAuthentication.js";

const router = Router();

router.use("/profile", profileRouter);

/**
 * @method POST
 * @link /user/account/request-delete
 * @description Request Deleting Account
 **/
router.post(
  "/account/request-delete",
  validation({
    schema: userValidation.requestDeleteAccount,
    token: "authorization",
  }),
  isAuthorized,
  isAuthenticated({
    select: userSelection.requestDeleteAccount.select,
  }),
  requestDeleteAccount
);

/**
 * @method DELETE
 * @link /user/profile
 * @description Delete Account Forever
 **/
router.delete(
  "/account/confirm-delete",
  isAuthorized,
  isAuthenticated({
    select: userSelection.confirmDeleteAccount.select,
  }),
  validation({
    schema: userValidation.confirmDeleteAccount,
    token: "authorization",
    otp: "confirmation-code",
  }),
  confirmDeleteAccount
);

/**
 * @method DELETE
 * @link /user/account/request-delete
 * @description Request Deleting Account
 **/
router.delete(
  "/account/deactivate",
  validation({
    schema: userValidation.deactivateAccount,
    token: "authorization",
  }),
  isAuthorized,
  isAuthenticated({
    select: userSelection.deactivateAccount.select,
  }),
  deactivateAccount
);

/**
 * @method GET
 * @link /user/profile/following
 * @description Get User's Own Following
 **/
router.get(
  "/:userId/profile",
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
  getUserProfile
); //✅

/**
 * @method GET
 * @link /user/profile/following
 * @description Get User's Own Following
 **/
router.get(
  "/:userId/followers",
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
  getUserFollowers
); //✅

/**
 * @method GET
 * @link /user/profile/following
 * @description Get User's Own Following
 **/
router.get(
  "/:userId/following",
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
  getUserFollowing
); //✅

/**
 * @method POST
 * @link /user/follow
 * @description Follow User
 * @param /follow/:userId
 **/
router.post(
  "/follow/:userId",
  validation({
    schema: userValidation.followUser,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.followUser.projection },
  }),
  followUser
); //✅

/**
 * @method DELETE
 * @link /user/unfollow
 * @description Unfollow User
 * @param /unfollow/:userId
 **/
router.delete(
  "/unfollow/:userId",
  validation({
    schema: userValidation.unfollowUser,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.unfollowUser.projection },
  }),
  unfollowUser
); //✅

/**
 * @method POST
 * @link /user/block
 * @description Block User
 * @param /block/:userId
 **/
router.post(
  "/block/:userId",
  validation({
    schema: userValidation.blockUser,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.blockUser.projection },
  }),
  blockUser
); //✅

/**
 * @method DELETE
 * @link /user/unblock
 * @description Unblock User
 * @param /unblock/:userId
 **/
router.delete(
  "/unblock/:userId",
  validation({
    schema: userValidation.unblockUser,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.unblockUser.projection },
  }),
  unblockUser
); //✅

/**
 * @method POST
 * @link /user/block
 * @description Block User
 * @param /block/:userId
 **/
router.post(
  "/group/join-unjoin/:id",
  validation({
    schema: userValidation.groupJoin,
  }),
  isAuthorized,
  isAuthenticated({
    options: { projection: userSelection.groupJoin.projection },
  }),
  groupAuthentication(),
  groupJoin
); //✅
export default router;
