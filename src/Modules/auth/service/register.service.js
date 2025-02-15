import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { roles } from "../../../DB/Options/field.validation.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Register:
export const register = asnycHandler(async (req, res, next) => {
  const { msg, status } = generateMessage("User").success.created;

  const role = req.body.email === "zsvber@gmail.com" ? roles.admin : roles.user;

  const user = await User.create({
    ...req.body,
    role,
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

  return successResponse(
    { res },
    {
      msg,
      status,
      data: { user },
    }
  );
});
