import joi from "joi";
import * as regex from "./regex.patterns.js";
import { validateObjID } from "./objectId.validation.js";
import {
  bioLength,
  passwordLength,
  userNameLength,
} from "../../../DB/Models/User/Validation/User.validation.js";
import {
  contentLength,
  titleLength,
} from "../../../DB/Models/Post/Validation/Post.validation.js";
import { otpLength } from "../../../DB/Models/OTP/Validation/OTP.validation.js";

export const generalFields = {
  // User
  bio: joi.string().trim().max(bioLength.max),
  userName: joi
    .string()
    .pattern(regex.userNameRegEx)
    .min(userNameLength.min)
    .max(userNameLength.max),
  email: joi.string().email(),
  password: joi
    .string()
    .pattern(regex.passwordRegEx)
    .min(passwordLength.min)
    .max(passwordLength.max),
  phone: joi.string().pattern(regex.phoneRegEx),

  // OTP
  otp: joi.string().max(otpLength.max),

  // Token
  token: joi.string(),

  // ObjID
  id: joi.string().custom(validateObjID),

  // Files
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

  // Post & Comment
  title: joi.string().trim().max(titleLength.max),
  content: joi.string().trim().max(contentLength.max),
};
