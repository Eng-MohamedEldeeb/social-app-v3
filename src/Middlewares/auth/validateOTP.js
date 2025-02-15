import OTP from "../../DB/Models/OTP/OTP.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const validateOTP = ({ otpType = "", otpFieldName = "" } = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { email, newEmail } = req.body;
    const otpCode = req.headers[otpFieldName];

    const result = await OTP.findOne(
      { email: email || newEmail, otpType },
      {},
      { projection: { otp: 1, attempts: 1, otpType: 1 } }
    );

    if (!result) {
      const { error, status } = generateMessage().errors.invalidOTP;

      return errorResponse(
        { next },
        {
          error,
          status,
        }
      );
    }

    // !compareValue({
    //   plainText: otpCode,
    //   cryptedValue: result.otp,
    // })
    if (otpCode != result.otp && result.attempts != 4) {
      result.attempts += 1;
      result.save();

      const { error, status } = generateMessage().errors.invalidOTP;

      return errorResponse(
        { next },
        {
          error,
          status,
        }
      );
    }

    if (otpCode != result.otp && result.attempts === 4) {
      const { error, status } = generateMessage().errors.blockedReq;

      await OTP.findOneAndUpdate({ email }, { iniAt: Date.now() });

      return errorResponse(
        { next },
        {
          error,
          status,
        }
      );
    }

    return next();
  });
};
