// DB Model :
import OTP from "../../../DB/Models/OTP/OTP.model.js";

// Utils :
import { otpTypes } from "../../../DB/Models/OTP/Validation/OTP.validation.js";
import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Forgot Password:
export const requestChangePassword = asnycHandler(async (req, res, next) => {
  // E-mail Info :
  const { email } = req.body;

  // User Existence Searching :
  const user = await User.findOne({ email }).lean().select({ email: 1 });

  //! If There Was No User :
  if (!user)
    return errorResponse(
      { next },
      { error: generateMessage("User").errors.notFound.error, status: 404 }
    );

  // Searching For The Request OTP If Existed :
  const existOtp = await OTP.findOne({
    email,
    otpType: otpTypes.resetPassword,
  })
    .lean()
    .select({ otp: 1 });

  //! If There Was Already An Existed OTP For The Same Request :
  if (existOtp)
    return errorResponse(
      { next },
      { error: generateMessage().errors.codeAlreadySent.error, status: 400 }
    );

  const data = await OTP.create({ email, otpType: otpTypes.resetPassword });

  return successResponse(
    { res },
    {
      msg: generateMessage().success.sendOTP.msg,
      status: 200,
      data,
    }
  );
});
