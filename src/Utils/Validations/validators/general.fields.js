import joi from "joi";
import * as regex from "./regex.patterns.js";
import * as fieldOptions from "../../../DB/Options/field.length.js";
import { validateObjID } from "./objectId.validation.js";

export const generalFields = {
  // User

  bio: joi.string().trim().max(fieldOptions.bioLength.max),
  userName: joi
    .string()
    .pattern(regex.userNameRegEx)
    .min(fieldOptions.userNameLength.min)
    .max(fieldOptions.userNameLength.max),
  email: joi.string().email(),
  password: joi
    .string()
    .pattern(regex.passwordRegEx)
    .min(fieldOptions.passwordLength.min)
    .max(fieldOptions.passwordLength.max),
  phone: joi.string().pattern(regex.phoneRegEx),

  otp: joi.string().max(fieldOptions.otpLength.max),

  token: joi.string().custom(validateObjID),

  file: {
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().required(),
  },

  fileType: {
    mimetype: joi.string(),
  },

  files: joi.array().items(joi.ref("file")),

  // Post
  title: joi.string().trim().min(fieldOptions.titleLength.max),
  content: joi.string().trim().min(fieldOptions.contentLength.max),
};
