import { Schema, Types } from "mongoose";
import * as regex from "../../../../Utils/Validation/validators/regex.patterns.js";
import * as fieldValidation from "../../../Options/field.validation.js";
import { generateMessage } from "../../../../Utils/Messages/messages.generator.js";
import {
  bioLength,
  passwordLength,
  roles,
  userNameLength,
} from "../Validation/User.validation.js";

const userSchema = new Schema(
  {
    // firstName: String,
    // lastName: String,
    // birthDate: Date,

    userName: {
      type: String,
      validate: {
        validator: fieldValidation.validateField(regex.userNameRegEx),
        message: generateMessage("userName").errors.invalidFormate.error,
      },
      minlength: [
        fieldValidation.fieldLength({
          fieldName: "userName",
          min: userNameLength.min,
        }).min.value,
        fieldValidation.fieldLength({
          fieldName: "userName",
          min: userNameLength.min,
        }).min.msg,
      ],
      maxlength: [
        fieldValidation.fieldLength({
          fieldName: "userName",
          max: userNameLength.max,
        }).max.value,
        fieldValidation.fieldLength({
          fieldName: "userName",
          max: userNameLength.max,
        }).max.msg,
      ],
      unique: [true, generateMessage("userName").errors.alreadyExist.error],
      required: [true, generateMessage("userName").errors.required.error],
      trim: true,
    },

    email: {
      type: String,
      validate: {
        validator: fieldValidation.validateField(regex.emailRegEx),
        message: generateMessage("email").errors.invalidFormate.error,
      },
      unique: [true, generateMessage("email").errors.alreadyExist.error],
      required: [true, generateMessage("email").errors.required.error],
      trim: true,
    },

    tempEmail: {
      type: String,
      validate: {
        validator: fieldValidation.validateField(regex.emailRegEx),
        message: generateMessage("email").errors.invalidFormate.error,
      },
      trim: true,
    },

    password: {
      type: String,
      minlength: [
        fieldValidation.fieldLength({
          fieldName: "Password",
          min: passwordLength.min,
        }).min.value,
        fieldValidation.fieldLength({
          fieldName: "Password",
          min: passwordLength.min,
        }).min.msg,
      ],
      maxlength: [
        fieldValidation.fieldLength({
          fieldName: "Password",
          max: passwordLength.max,
        }).max.value,
        fieldValidation.fieldLength({
          fieldName: "Password",
          max: passwordLength.max,
        }).max.msg,
      ],
      validate: {
        validator: fieldValidation.validateField(regex.passwordRegEx),
        message: generateMessage("Password").errors.invalidFormate.error,
      },
    },

    passwords: [String],

    phone: {
      type: String,
      // unique: [true, generateMessage("Phone Number").errors.alreadyExist.error],
      trim: true,
    },

    profilePicture: {
      secure_url: {
        type: String,
        default: fieldValidation.defaultValues.profilePicture.secure_url,
      },
      public_id: {
        type: String,
        default: fieldValidation.defaultValues.profilePicture.public_id,
      },
    },

    bio: {
      type: String,
      maxlength: [
        fieldValidation.fieldLength({
          fieldName: "Bio",
          max: bioLength.max,
        }).max.value,
        fieldValidation.fieldLength({
          fieldName: "Bio",
          max: bioLength.max,
        }).max.msg,
      ],
      trim: true,
    },

    role: {
      type: String,
      enum: {
        values: Object.values(roles),
        message: generateMessage().errors.enums.error,
      },
      default: roles.user,
    },

    // Posts :
    posts: [{ type: Types.ObjectId, ref: "post" }],

    // Groups :
    createdGroups: [{ type: Types.ObjectId, ref: "group" }],
    joinedGroups: [{ type: Types.ObjectId, ref: "group" }],

    // Users :
    followers: [{ type: Types.ObjectId, ref: "user" }],
    following: [{ type: Types.ObjectId, ref: "user" }],
    blockList: [{ type: Types.ObjectId, ref: "user" }],
    viewrs: [{ type: Types.ObjectId, ref: "user" }],

    emailChangedAt: Date,
    passwordChangedAt: Date,
    privateProfile: Boolean,
    isDeactivated: Boolean,
  },
  {
    timestamps: true,
  }
);

export default userSchema;
