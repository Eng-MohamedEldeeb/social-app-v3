import { transporter } from "../Config/transporter.js";
import * as emailSchema from "../Schemas/email.schema.js";

export const emailTypes = {
  greeting: "greeting",
  confirmation: "confirmation",
  verifyEmail: "verifyEmail",
  resetPassword: "resetPassword",
  deleteAccount: "deleteAccount",
};

export const sendEmailHandler = async ({
  emailType = "",
  email = "",
  userName = "",
  otp = "",
} = {}) => {
  try {
    switch (emailType) {
      case emailTypes.greeting:
        await transporter.sendMail(
          emailSchema.greetingEmail({ email, userName })
        );
        break;
      case emailTypes.confirmation:
        await transporter.sendMail(emailSchema.confirmEmail({ email, otp }));
        break;
      case emailTypes.verifyEmail:
        await transporter.sendMail(emailSchema.verifyEmail({ email, otp }));
        break;
      case emailTypes.resetPassword:
        await transporter.sendMail(emailSchema.resetPassword({ email, otp }));
      case emailTypes.deleteAccount:
        await transporter.sendMail(emailSchema.deleteAccount({ email, otp }));
        break;
    }
  } catch (error) {
    console.error("NodeMailer Error:", error);
  }
};
