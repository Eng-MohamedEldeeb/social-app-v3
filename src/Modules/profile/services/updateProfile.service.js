import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Update User's Own Profile:
export const updateProfile = asnycHandler(async (req, res, next) => {
  // Updated Data :
  const { email, ...updatedData } = req.body;

  // If There Was Avatar Updating :
  if (req.file) {
    await cloudUploader({
      req,
      folderType: folderTypes.avatar,
      userId: req.user._id,
      replaceWith: req.user.avatar.public_id,
    })
      .then(async (data) => {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            ...updatedData,
            ...(email && email != req.user.email && { tempEmail: email }),
            ...(data.public_id && {
              $set: {
                avatar: {
                  public_id: data.public_id,
                  secure_url: data.secure_url,
                },
              },
            }),
          },
          {
            new: true,
            projection: `${Object.keys({
              ...(email != req.user.email && { tempEmail: email }),
              ...updatedData,
            }).join(" ")} ${data.public_id && "avatar.secure_url"}`,
            lean: true,
          }
        );

        return successResponse(
          { res },
          {
            data: updatedUser,
            msg: generateMessage("Profile").success.updated.msg,
            status: 200,
          }
        );
      })
      .catch((err) => {
        return errorResponse({ next }, { error: err.message, status: 500 });
      });
    return;
  }

  // If There Was No Avatar Updating :
  const data = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...updatedData,
      ...(email && email != req.user.email && { tempEmail: email }),
    },
    {
      new: true,
      projection: `${Object.keys({
        ...(email != req.user.email && { tempEmail: email }),
        ...updatedData,
      }).join(" ")}`,
      lean: true,
    }
  );

  return successResponse(
    { res },
    {
      data,
      msg: generateMessage("Profile").success.updated.msg,
      status: 200,
    }
  );
}); //✅

export const confirmNewEmail = asnycHandler(async (req, res, next) => {
  // User Id :
  const { _id } = req.user;

  // User's New Email :
  const { newEmail } = req.body;

  // Updating User :
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
