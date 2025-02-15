import joi from "joi";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

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
    ["authorization"]: generalFields.token.required(),

    newEmail: generalFields.email.required(),
  })
  .required();

// Confirm New Password User:
export const confirmNewPassword = joi
  .object()
  .keys({
    oldPassword: generalFields.password.required(),
    newPassword: generalFields.password
      .invalid(joi.ref("oldPassword"))
      .required(),
    confirmPassword: generalFields.password
      .valid(joi.ref("newPassword"))
      .required(),
    ["confirmation-code"]: generalFields.otp.required(),
  })
  .required();
