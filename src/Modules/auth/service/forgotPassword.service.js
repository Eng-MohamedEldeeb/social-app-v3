import OTP from "../../../DB/Models/OTP.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { otpTypes } from "../../../DB/Options/field.validation.js";

// Forgot Password:
export const forgotPassword = asnycHandler(async (req, res, next) => {
  const { email } = req.body;
  const successMsg = generateMessage().success.sendOTP;

  const existOtp = await OTP.findOne(
    {
      email,
      otpTypes: otpTypes.resetPassword,
    },
    {},
    {
      projection: { otp: 1 },
    }
  );
  if (existOtp) {
    const { error, status } = generateMessage().errors.codeAlreadySent;
    return errorResponse({ next }, { error, status });
  }

  const data = await OTP.create({ email, otpType: otpTypes.resetPassword });

  return successResponse(
    { res },
    {
      msg: successMsg.msg,
      status: successMsg.status,
      data,
    }
  );
});
