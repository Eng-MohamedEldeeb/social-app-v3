import OTP from "../../../DB/Models/OTP/OTP.model.js";
import { otpTypes } from "../../../DB/Models/OTP/Validation/OTP.validation.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Confirm E-mail:
export const confirmEmail = asnycHandler(async (req, res, next) => {
  const { email } = req.body;
  const { msg, status } = generateMessage().success.sendOTP;

  const existOtp = await OTP.findOne(
    {
      email,
      otpType: otpTypes.confirmation,
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

  const data = await OTP.create({ email, otpType: otpTypes.confirmation });

  return successResponse(
    { res },
    {
      msg,
      status,
      data,
    }
  );
});
