import { transporter } from "../Config/transporter.js";
import * as emailSchema from "../Schemas/email.schema.js";

export const emailTypes = {
  greeting: "greeting",
  confirmEmail: "confirmEmail",
  verifyEmail: "verifyEmail",
  resetPassword: "resetPassword",
  changePassword: "changePassword",
  deleteAccount: "deleteAccount",
};

export const sendEmailHandler = async ({
  emailType = "",
  email = "",
  userName = "",
  otp = "",
} = {}) => {
  try {
    transporter.sendMail(emailSchema[emailType]({ email, userName, otp }));
  } catch (error) {
    console.error("NodeMailer Error:", error);
  }
};
