import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

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

  return successResponse(
    { res },
    {
      data,
      msg,
      status,
    }
  );
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
  return successResponse(
    { res },
    {
      data,
      msg: generateMessage("E-mail").success.updated.msg,
      status: generateMessage("E-mail").success.updated.status,
    }
  );
}); //✅
