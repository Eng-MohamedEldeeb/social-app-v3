import joi from "joi";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";

export const getUserProfile = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),
    userId: generalFields.id.required(),
  })
  .required();
export const getUserFollowers = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),
    userId: generalFields.id.required(),
  })
  .required();
export const getUserFollowing = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),
    userId: generalFields.id.required(),
  })
  .required();

// [Follow User]:
export const followUser = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),
    userId: generalFields.id.required(),
  })
  .required();

// Unfollow User:
export const unfollowUser = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),
    userId: generalFields.id.required(),
  })
  .required();

// Block User:
export const blockUser = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),
    userId: generalFields.id.required(),
  })
  .required();

// Unblock User:
export const unblockUser = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),
    userId: generalFields.id.required(),
  })
  .required();

// Join Group:
export const groupJoin = joi
  .object()
  .keys({
    id: generalFields.id.required(),
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Request Delete Account:
export const requestDeleteAccount = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Confirm Delete Account:
export const confirmDeleteAccount = joi
  .object()
  .keys({
    ["confirmation-code"]: generalFields.otp.required(),
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Deactivate Account :
export const deactivateAccount = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),
  })
  .required();
