import OTP from "../../../DB/Models/OTP/OTP.model.js";
import User from "../../../DB/Models/User/User.model.js";
import { otpTypes } from "../../../DB/Models/OTP/Validation/OTP.validation.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { compareValue } from "../../../Utils/Security/hash.js";

export const deleteProfile = asnycHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const { password: dbPassword, email: dbEmail } = req.user;

  if (
    !compareValue({
      plainText: password,
      cryptedValue: dbPassword,
    }) ||
    email != dbEmail
  )
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.invalidCredentials.error,
        status: generateMessage().errors.invalidCredentials.status,
      }
    );

  const existOtp = await OTP.findOne(
    {
      email,
      otpType: otpTypes.deleteAccount,
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

  const data = await OTP.create({ email, otpType: otpTypes.deleteAccount });

  return successResponse(
    { res },
    {
      msg: generateMessage().success.sendOTP.msg,
      status: generateMessage().success.sendOTP.status,
      data,
    }
  );
}); //✅

export const confirmDeleteProfile = asnycHandler(async (req, res, next) => {
  const data = await User.findByIdAndDelete(req.user._id);
  if (!data)
    return errorResponse(
      { next },
      {
        error,
        error: generateMessage("Account").errors.notFound,
        status: generateMessage("Account").errors.notFound.status,
      }
    );

  return successResponse(
    { res },
    {
      msg: generateMessage("Account").success.deleted.msg,
      status: generateMessage("Account").success.deleted.status,
      data,
    }
  );
}); //✅
