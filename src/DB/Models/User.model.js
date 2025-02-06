import mongoose, { Schema, Types, model } from "mongoose";
import * as regex from "../../Utils/Validations/validators/regex.patterns.js";
import * as fieldOptions from "../Options/field.length.js";
import * as fieldValidation from "../Options/field.validation.js";
import { encryptValue, hashValue } from "../../Utils/Security/hash.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import randomstring from "randomstring";
import sendEmail from "../../Utils/Emails/email.event.js";
import OTP from "./OTP.model.js";
import { emailTypes } from "../../Utils/Emails/Handler/sendEmail.handler.js";

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
        fieldOptions.fieldLength({
          fieldName: "userName",
          min: fieldOptions.userNameLength.min,
        }).min.value,
        fieldOptions.fieldLength({
          fieldName: "userName",
          min: fieldOptions.userNameLength.min,
        }).min.msg,
      ],
      maxlength: [
        fieldOptions.fieldLength({
          fieldName: "userName",
          max: fieldOptions.userNameLength.max,
        }).max.value,
        fieldOptions.fieldLength({
          fieldName: "userName",
          max: fieldOptions.userNameLength.max,
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
        fieldOptions.fieldLength({
          fieldName: "Password",
          min: fieldOptions.passwordLength.min,
        }).min.value,
        fieldOptions.fieldLength({
          fieldName: "Password",
          min: fieldOptions.passwordLength.min,
        }).min.msg,
      ],
      maxlength: [
        fieldOptions.fieldLength({
          fieldName: "Password",
          max: fieldOptions.passwordLength.max,
        }).max.value,
        fieldOptions.fieldLength({
          fieldName: "Password",
          max: fieldOptions.passwordLength.max,
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
      unique: [true, generateMessage("Phone Number").errors.alreadyExist.error],
      required: [
        true,
        generateMessage("Phone Number").errors.required.error.error,
      ],
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
        fieldOptions.fieldLength({
          fieldName: "Bio",
          max: fieldOptions.bioLength.max,
        }).max.value,
        fieldOptions.fieldLength({
          fieldName: "Bio",
          max: fieldOptions.bioLength.max,
        }).max.msg,
      ],
      trim: true,
    },

    posts: [{ type: Types.ObjectId, ref: "post" }],
    followers: [{ type: Types.ObjectId, ref: "user" }],
    following: [{ type: Types.ObjectId, ref: "user" }],
    blockList: [{ type: Types.ObjectId, ref: "user" }],
    viewrs: [{ type: Types.ObjectId, ref: "user" }],

    emailChangedAt: Date,
    passwordChangedAt: Date,
    privateProfile: Boolean,
  },
  {
    timestamps: true,
    // id: false,
    versionKey: false,
    skipVersioning: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const hashedPassword = hashValue({ payload: this.password });
    this.password = hashedPassword;
    this.passwords.push(hashedPassword);
  }
  if (this.isModified("phone"))
    this.phone = encryptValue({ payload: this.phone });
  return next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const updatedDoc = this.getUpdate();

  if (updatedDoc.password) {
    const hashedPassword = hashValue({ payload: updatedDoc.password });
    this.setUpdate({
      $addToSet: { passwords: hashedPassword },
      password: hashedPassword,
      passwordChangedAt: Date.now(),
    });
  }
  if (updatedDoc.email) {
    const otp = randomstring.generate({ length: 4, charset: "numeric" });
    const otpType = emailTypes.verifyEmail;

    await OTP.create({ otp, otpType, email: updatedDoc.email });
    sendEmail.emit("sendEmail", {
      emailType: emailTypes.verifyEmail,
      email: updatedDoc.email,
      otp: otpCode,
    });
  }
  return next();
});

const User = mongoose.models.User || model("user", userSchema);

export default User;
