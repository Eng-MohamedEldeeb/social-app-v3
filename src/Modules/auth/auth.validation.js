import joi from "joi";
import { generalFields } from "../../Utils/Validations/validators/general.fields.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

export const confirmEmailSchema = joi
  .object()
  .keys({
    email: generalFields.email.required(),
  })
  .required();

export const registerSchema = joi
  .object()
  .keys({
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.password
      .valid(joi.ref("password"))
      .required(),
    phone: generalFields.phone.required(),
    file: joi.object().keys({
      ...generalFields.file,
      mimetype: generalFields.fileType.mimetype
        .valid(...fileTypes.img)
        .required(),
    }),
    registeration: generalFields.otp.required(),
  })
  .required();

export const loginSchema = joi
  .object()
  .keys({
    userName: generalFields.userName.required(),
    password: generalFields.password.required(),
  })
  .required();

export const forgotPasswordSchema = joi
  .object()
  .keys({
    email: generalFields.email.required(),
  })
  .required();

export const resetPasswordSchema = joi
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
