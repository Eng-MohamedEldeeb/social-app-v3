import OTP from "../../../DB/Models/OTP/OTP.model.js";
import User from "../../../DB/Models/User/User.model.js";
import { otpTypes } from "../../../DB/Models/OTP/Validation/OTP.validation.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { compareValue } from "../../../Utils/Security/hash.js";

export const changePassword = asnycHandler(async (req, res, next) => {
  const { email } = req.user;

  const existOtp = await OTP.findOne(
    {
      email,
      otpType: otpTypes.confirmNewPassword,
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

  const data = await OTP.create({
    email,
    otpType: otpTypes.confirmNewPassword,
  });

  return successResponse(
    { res },
    {
      msg: generateMessage().success.sendOTP.msg,
      status: generateMessage().success.sendOTP.status,
      data,
    }
  );
}); //✅

export const confirmNewPassword = asnycHandler(async (req, res, next) => {
  const { newPassword } = req.body;

  const { passwords } = req.user;
  if (
    passwords.some((pass) =>
      compareValue({ plainText: newPassword, cryptedValue: pass })
    )
  )
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.conflictedPasswords.error,
        status: generateMessage().errors.conflictedPasswords.status,
      }
    );

  const data = await User.findOneAndUpdate(
    { _id: req.token._id, isDeactivated: { $exists: false } },
    { password: newPassword },
    { new: true, lean: true, projection: { password: 1, passwords: 1 } }
  );

  return successResponse(
    { res },
    {
      msg: generateMessage("Password").success.updated.msg,
      status: generateMessage("Password").success.updated.status,
      data,
    }
  );
}); //✅
