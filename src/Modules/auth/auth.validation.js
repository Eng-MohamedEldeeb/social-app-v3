import joi from "joi";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

export const confirmEmail = joi
  .object()
  .keys({
    email: generalFields.email.required(),
  })
  .required();

export const register = joi
  .object()
  .keys({
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.password
      .valid(joi.ref("password"))
      .required(),
    file: joi.object().keys({
      ...generalFields.file,
      mimetype: generalFields.fileType.mimetype
        .valid(...fileTypes.img)
        .required(),
    }),
    registeration: generalFields.otp.required(),
  })
  .required();

export const login = joi
  .object()
  .keys({
    userName: generalFields.userName.required(),
    password: generalFields.password.required(),
  })
  .required();

export const forgotPassword = joi
  .object()
  .keys({
    email: generalFields.email.required(),
  })
  .required();

export const resetPassword = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    newPassword: generalFields.password.required(),
    confirmNewPassword: generalFields.password
      .valid(joi.ref("newPassword"))
      .required(),
    ["reset-password"]: generalFields.otp.required(),
  })
  .required();
