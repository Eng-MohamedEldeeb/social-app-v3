import joi from "joi";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

export const getUserProfile = joi
  .object()
  .keys({
    userID: generalFields.id.required(),
  })
  .required();
export const getUserFollowers = joi
  .object()
  .keys({
    userID: generalFields.id.required(),
  })
  .required();
export const getUserFollowing = joi
  .object()
  .keys({
    userID: generalFields.id.required(),
  })
  .required();

// Update Profile:
export const updateProfile = joi
  .object()
  .keys({
    bio: generalFields.bio,
    userName: generalFields.userName,
    phone: generalFields.phone,
    email: generalFields.email,
    file: joi.object().keys({
      ...generalFields.file,
      mimetype: generalFields.fileType.mimetype.valid(...fileTypes.img),
    }),
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Confirm E-mail:
export const confirmNewEmail = joi
  .object()
  .keys({
    ["confirmation-code"]: generalFields.otp.required(),
    newEmail: generalFields.email.required(),
  })
  .required();

// [Follow User]:
export const followUser = joi
  .object()
  .keys({
    userID: generalFields.id.required(),
  })
  .required();

// Unfollow User:
export const unfollowUser = joi
  .object()
  .keys({
    userID: generalFields.id.required(),
  })
  .required();

// Block User:
export const blockUser = joi
  .object()
  .keys({
    userID: generalFields.id.required(),
  })
  .required();

// Unblock User:
export const unblockUser = joi
  .object()
  .keys({
    userID: generalFields.id.required(),
  })
  .required();
