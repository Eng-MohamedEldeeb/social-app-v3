import OTP from "../../../DB/Models/OTP.model.js";
import User from "../../../DB/Models/User.model.js";
import { otpTypes } from "../../../DB/Options/field.validation.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { compareValue } from "../../../Utils/Security/hash.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Get User's Own Profile:
export const getProfile = asnycHandler(async (req, res, next) => {
  return successResponse(res, { data: req.user });
}); //✅

// Get User's Own Profile Following:
export const getProfileFollowing = asnycHandler((req, res, next) => {
  return successResponse(res, { data: req.user });
}); //✅

// Get User's Own Profile Followers:
export const getProfileFollowers = asnycHandler((req, res, next) => {
  return successResponse(res, { data: req.user });
}); //✅

export const togglePrivateProfile = asnycHandler(async (req, res, next) => {
  const { _id, privateProfile } = req.user;
  const updateProfile = await User.findOneAndUpdate(
    { _id, isDeactivated: { $exists: false } },
    { privateProfile: !privateProfile },
    { lean: true, new: true, projection: "privateProfile" }
  );

  if (!updateProfile)
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.unAuthenticated.error,
        status: generateMessage().errors.unAuthenticated.status,
      }
    );

  return successResponse(res, {
    msg: generateMessage("User Profile").success.msg,
    status: generateMessage("User Profile").success.status,
    data: updateProfile,
  });
}); //✅

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

  return successResponse(res, {
    msg: generateMessage().success.sendOTP.msg,
    status: generateMessage().success.sendOTP.status,
    data,
  });
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

  return successResponse(res, {
    msg: generateMessage("Account").success.deleted.msg,
    status: generateMessage("Account").success.deleted.status,
    data,
  });
}); //✅

// Update User's Own Profile:
export const updateProfile = asnycHandler(async (req, res, next) => {
  const { email, ...updatedData } = req.body;
  const { msg, status } = generateMessage("Profile").success.updated;
  let uploadedImg = {};

  if (req.file) {
    const { public_id, secure_url } = await cloudUploader({
      req,
      folderType: folderTypes.avatar,
      userId: req.user._id,
      replaceWith: req.user.profilePicture.public_id,
    });

    uploadedImg = { public_id, secure_url };
  }

  const data = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...updatedData,
      ...(email && email != req.user.email && { tempEmail: email }),
      ...(uploadedImg.public_id && {
        $set: {
          profilePicture: {
            public_id: uploadedImg.public_id,
            secure_url: uploadedImg.secure_url,
          },
        },
      }),
    },
    {
      new: true,
      projection: `${Object.keys({
        ...(email != req.user.email && { tempEmail: email }),
        ...updatedData,
      }).join(" ")} ${uploadedImg.public_id && "profilePicture"}`,
      lean: true,
    }
  );

  return successResponse(res, {
    data,
    msg,
    status,
  });
}); //✅

export const confirmNewEmail = asnycHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { newEmail } = req.body;
  const data = await User.findByIdAndUpdate(
    _id,
    { email: newEmail, $unset: { tempEmail: 1 } },
    {
      new: true,
      lean: true,
      projection: {
        email: 1,
      },
    }
  );
  return successResponse(res, {
    data,
    msg: generateMessage("E-mail").success.updated.msg,
    status: generateMessage("E-mail").success.updated.status,
  });
}); //✅

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

  return successResponse(res, {
    msg: generateMessage().success.sendOTP.msg,
    status: generateMessage().success.sendOTP.status,
    data,
  });
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

  return successResponse(res, {
    msg: generateMessage("Password").success.updated.msg,
    status: generateMessage("Password").success.updated.status,
    data,
  });
}); //✅

export const twoStepsVerification = asnycHandler(async (req, res, next) => {});

// -----------------------------------------------------------------------------------
