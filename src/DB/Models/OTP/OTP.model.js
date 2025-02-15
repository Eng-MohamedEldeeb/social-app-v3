import { model } from "mongoose";
import optSchema from "./Schema/OTP.schema.js";
import { pre_save } from "./Hooks/OTP.hooks.js";

optSchema.index({ iniAt: 1 }, { expires: "2.5m" });

optSchema.pre("save", pre_save);

const OTP = model("otp", optSchema);

export default OTP;
