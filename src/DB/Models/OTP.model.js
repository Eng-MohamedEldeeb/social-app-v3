import mongoose, { Schema, model } from "mongoose";
import { otpTypes, validateField } from "../Options/field.validation.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
// import { hashValue } from "../../Utils/Security/hash.js";
import sendEmail from "../../Utils/Emails/email.event.js";
import { emailTypes } from "../../Utils/Emails/Handler/sendEmail.handler.js";
import { emailRegEx } from "../../Utils/Validation/validators/regex.patterns.js";
import randomstring from "randomstring";
const optSchema = new Schema(
  {
    otp: {
      type: String,
    },

    email: {
      type: String,
      validate: {
        validator: validateField(emailRegEx),
      },
      required: [true, generateMessage("email").errors.required.error],
    },

    otpType: {
      type: String,
      enum: {
        values: Object.values(otpTypes),
        message: () => {
          return generateMessage("OTP Request Type").errors.invalidFormate
            .error;
        },
      },
    },

    attempts: {
      type: Number,
      default: 0,
    },

    iniAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

optSchema.index({ iniAt: 1 }, { expires: "2.5m" });

optSchema.pre("save", function (next) {
  if (this.isModified("attempts")) return next();

  const otpCode = randomstring.generate({ length: 4, charset: "numeric" });
  const otpType = this.otpType;

  sendEmail.emit("sendEmail", {
    emailType: emailTypes[otpType],
    email: this.email,
    otp: otpCode,
  });
  this.otp = otpCode;
  return next();
});

const OTP = mongoose.models.otp || model("otp", optSchema);

export default OTP;
