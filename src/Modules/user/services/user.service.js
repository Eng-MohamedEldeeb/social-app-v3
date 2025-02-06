import User from "../../../DB/Models/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

export const getProfile = asnycHandler(async (req, res, next) => {
  return successResponse(res, { data: req.user });
});
export const getProfileFollowing = asnycHandler((req, res, next) => {
  return successResponse(res, { data: req.user });
});
export const getProfileFollowers = asnycHandler((req, res, next) => {
  return successResponse(res, { data: req.user });
});

export const updateProfile = asnycHandler(async (req, res, next) => {
  const updatedData = req.body;
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
      projection: `${Object.keys(updatedData).join(" ")} ${
        uploadedImg.public_id && "profilePicture"
      }`,
      lean: true,
    }
  );

  return successResponse(res, {
    data,
    msg,
    status,
  });
});
export const twoStepsVerification = asnycHandler((req, res, next) => {});
export const privateProfile = asnycHandler((req, res, next) => {});
export const changeEmail = asnycHandler((req, res, next) => {});
export const confirmNewEmail = asnycHandler((req, res, next) => {});
export const changePassword = asnycHandler((req, res, next) => {});
export const confirmNewPassword = asnycHandler((req, res, next) => {});

export const deleteProfile = asnycHandler((req, res, next) => {});

export const followUser = asnycHandler((req, res, next) => {});
export const unfollowUser = asnycHandler((req, res, next) => {});
export const blockUser = asnycHandler((req, res, next) => {});
export const unblockUser = asnycHandler((req, res, next) => {});

export const getUserProfile = asnycHandler((req, res, next) => {});
export const getUserFollowers = asnycHandler((req, res, next) => {});
export const getUserFollowing = asnycHandler((req, res, next) => {});
