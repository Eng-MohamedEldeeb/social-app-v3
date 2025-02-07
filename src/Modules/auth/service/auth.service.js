import OTP from "../../../DB/Models/OTP.model.js";
import User from "../../../DB/Models/User.model.js";
import * as token from "../../../Utils/Security/token.js";
import { compareValue } from "../../../Utils/Security/hash.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { otpTypes } from "../../../DB/Options/field.validation.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

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

  return successResponse(res, {
    msg,
    status,
    data,
  });
});

// Register:
export const register = asnycHandler(async (req, res, next) => {
  const { msg, status } = generateMessage("User").success.created;

  const user = await User.create({
    ...req.body,
  });

  if (req.file) {
    const { public_id, secure_url } = await cloudUploader({
      req,
      folderType: folderTypes.avatar,
      userId: user._id,
    });

    user.profilePicture = { public_id, secure_url };
    await user.save();
  }

  return successResponse(res, {
    msg,
    status,
    data: { user },
  });
});

// Login:
export const login = asnycHandler(async (req, res, next) => {
  const { password, email, userName, phone } = req.body;

  const successMsg = generateMessage("User").success.loggedIn;
  const errorMsg = generateMessage().errors.invalidCredentials;

  const user = await User.findOne(
    { $or: [{ email }, { userName }, { phone }] },
    {},
    { projection: { password: 1 } }
  );

  if (
    !compareValue({
      plainText: password,
      cryptedValue: user.password,
    })
  )
    return errorResponse(
      { next },
      {
        error: errorMsg.error,
        status: errorMsg.status,
      }
    );

  const accessToken = token.generateToken({
    payload: { _id: user._id, email, userName },
    expiresIn: "5d",
  });
  const refreshToken = token.generateToken({
    payload: { _id: user._id, email, userName },
    expiresIn: "14d",
  });
  return successResponse(res, {
    msg: successMsg.msg,
    status: successMsg.status,
    data: { accessToken, refreshToken },
  });
});

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

  return successResponse(res, {
    msg: successMsg.msg,
    status: successMsg.status,
    data,
  });
});

// Reset Password:
export const resetPassword = asnycHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const { passwords } = req.user;
  const successMsg = generateMessage("Password").success.updated;

  const checkExistedPassword = passwords.some((pass) =>
    compareValue({ plainText: newPassword, cryptedValue: pass })
  );

  if (
    compareValue({
      plainText: newPassword,
      cryptedValue: req.user.password,
    }) ||
    checkExistedPassword
  ) {
    const { error, status } = generateMessage().errors.conflictedPasswords;

    return errorResponse({ next }, { error, status });
  }

  const data = await User.findOneAndUpdate(
    { email },
    {
      password: newPassword,
      passwordChangedAt: Date.now(),
    },
    { new: true, projection: { password: 1, passwords: 1 } }
  );

  return successResponse(res, {
    msg: successMsg.msg,
    status: successMsg.status,
    data,
  });
});

// export const refreshToken = asnycHandler(async(req,res,next)=>{})
