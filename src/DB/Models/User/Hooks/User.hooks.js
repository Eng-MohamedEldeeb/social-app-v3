// Models :
import OTP from "../../OTP.model.js";
import Post from "../../Post.model.js";
import Comment from "../../Comment.model.js";

// Validations :
import * as fieldValidation from "../../../Options/field.validation.js";
import { emailTypes } from "../../../../Utils/Emails/Handler/sendEmail.handler.js";

// Hashing :
import { encryptValue, hashValue } from "../../../../Utils/Security/hash.js";

// Utils :
import sendEmail from "../../../../Utils/Emails/email.event.js";
import cloud from "../../../../Utils/Upload/Cloudinary/Config/cloud.config.js";

export const pre_save = async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = hashValue({ payload: this.password });
    this.password = hashedPassword;
    this.passwords.push(hashedPassword);
  }
  if (this.isModified("phone"))
    this.phone = encryptValue({ payload: this.phone });

  await OTP.findOneAndDelete({ email: this.email });
  return next();
};

export const pre_findOneAndUpdate = async function (next) {
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
};

export const post_findOneAndDelete = async function (doc, next) {
  const { _id, profilePicture } = doc;
  const userData = { owner: _id };
  console.log(this.getFilter());

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
};
