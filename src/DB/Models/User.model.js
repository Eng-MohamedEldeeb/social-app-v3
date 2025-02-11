import mongoose, { Schema, Types, model } from "mongoose";
import * as regex from "../../Utils/Validation/validators/regex.patterns.js";
import * as fieldOptions from "../Options/field.length.js";
import * as fieldValidation from "../Options/field.validation.js";
import { encryptValue, hashValue } from "../../Utils/Security/hash.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import randomstring from "randomstring";
import sendEmail from "../../Utils/Emails/email.event.js";
import OTP from "./OTP.model.js";
import { emailTypes } from "../../Utils/Emails/Handler/sendEmail.handler.js";
import Post from "./Post.model.js";
import cloud from "../../Utils/Upload/Cloudinary/Config/cloud.config.js";
import Comment from "./Comment.model.js";

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

    role: {
      type: String,
      enum: {
        values: Object.values(fieldValidation.roles),
        message: generateMessage().errors.enums.error,
      },
    },

    posts: [{ type: Types.ObjectId, ref: "post" }],
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
    // id: false,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = hashValue({ payload: this.password });
    this.password = hashedPassword;
    this.passwords.push(hashedPassword);
  }
  if (this.isModified("phone"))
    this.phone = encryptValue({ payload: this.phone });

  await OTP.findOneAndDelete({ email: this.email });
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
  if (updatedDoc.phone) {
    const encryptedphone = encryptValue({ payload: updatedDoc.phone });
    this.setUpdate({
      phone: encryptedphone,
    });
  }
  if (updatedDoc.tempEmail) {
    const otpType = fieldValidation.otpTypes.confirmNewEmail;

    const otpCode = await OTP.create({
      otpType,
      email: updatedDoc.tempEmail,
    });

    this.setUpdate({
      tempEmail: updatedDoc.tempEmail,
      emailChangedAt: Date.now(),
    });

    sendEmail.emit("sendEmail", {
      emailType: emailTypes.verifyEmail,
      email: updatedDoc.tempEmail,
      otp: otpCode.otp,
    });
  }
  return next();
});

userSchema.post("findOneAndDelete", async function (doc, next) {
  const { _id, profilePicture } = doc;
  const userData = { owner: _id };

  if (
    profilePicture.public_id !=
    fieldValidation.defaultValues.profilePicture.public_id
  )
    await cloud.uploader.destroy(profilePicture.public_id);

  Promise.allSettled([
    Post.deleteMany(userData),
    Comment.deleteMany(userData),
    OTP.findOneAndDelete({ email: doc.email }),
  ]);
});

const User = mongoose.models.User || model("user", userSchema);

export default User;
