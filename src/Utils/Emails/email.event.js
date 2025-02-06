import { EventEmitter } from "node:events";
import { sendEmailHandler } from "./Handler/sendEmail.handler.js";

const sendEmail = new EventEmitter();

sendEmail.on("sendEmail", async (data) => {
  const { emailType, email, userName, otp } = data;
  await sendEmailHandler({ emailType, email, userName, otp });
});

export default sendEmail;
