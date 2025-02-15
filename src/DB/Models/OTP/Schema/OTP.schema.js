import { Schema } from "mongoose";
import { otpTypes } from "../Validation/OTP.validation.js";
import { generateMessage } from "../../../../Utils/Messages/messages.generator.js";
// import { hashValue } from "../../Utils/Security/hash.js";
import { emailRegEx } from "../../../../Utils/Validation/validators/regex.patterns.js";
import { validateField } from "../../../Options/field.validation.js";

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

export default optSchema;
