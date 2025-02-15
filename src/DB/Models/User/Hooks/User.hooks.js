// Models :
import OTP from "../../OTP/OTP.model.js";
import Post from "../../Post/Post.model.js";

// Validations :
import * as fieldValidation from "../../../Options/field.validation.js";
import { emailTypes } from "../../../../Utils/Emails/Handler/sendEmail.handler.js";

// Hashing :
import { encryptValue, hashValue } from "../../../../Utils/Security/hash.js";

// Utils :
import sendEmail from "../../../../Utils/Emails/email.event.js";
import cloud from "../../../../Utils/Upload/Cloudinary/Config/cloud.config.js";
import { otpTypes } from "../../OTP/Validation/OTP.validation.js";

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
    const otpType = otpTypes.verifyEmail;

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
  const { _id, avatar } = doc;
  const userData = { owner: _id };

  if (avatar.public_id != fieldValidation.defaultValues.avatar.public_id)
    await cloud.uploader.destroy(avatar.public_id);

  await Promise.allSettled([
    Post.deleteMany(userData),
    OTP.findOneAndDelete({ email: doc.email }),
  ]);
};
