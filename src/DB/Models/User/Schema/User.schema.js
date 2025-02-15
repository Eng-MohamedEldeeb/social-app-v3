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
    // User Info :
    firstName: {
      type: String,
      required: [true, generateMessage("First Name").errors.required.error],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    age: Number,

    // Username :
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

    // Email :
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
    emailChangedAt: Date,

    // Password :
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
    passwordChangedAt: Date,

    phone: {
      type: String,
      // unique: [true, generateMessage("Phone Number").errors.alreadyExist.error],
      trim: true,
    },

    avatar: {
      secure_url: {
        type: String,
        default: fieldValidation.defaultValues.avatar.secure_url,
      },
      public_id: {
        type: String,
        default: fieldValidation.defaultValues.avatar.public_id,
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
    // posts: [{ type: Types.ObjectId, ref: "post" }],

    // Groups :
    createdGroups: [{ type: Types.ObjectId, ref: "group" }],
    joinedGroups: [{ type: Types.ObjectId, ref: "group" }],

    // Following-Followers :
    followers: [{ type: Types.ObjectId, ref: "user" }],
    following: [{ type: Types.ObjectId, ref: "user" }],

    // Block List :
    blockList: [{ type: Types.ObjectId, ref: "user" }],

    // Profile Viewers :
    viewers: [{ type: Types.ObjectId, ref: "user" }],

    // Profile Status :
    privateProfile: Boolean,
    isDeactivated: Boolean,
  },
  {
    timestamps: true,
    versionKey: false,

    // Virtuals ;
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

export default userSchema;
