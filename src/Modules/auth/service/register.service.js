// DB Model :
import User from "../../../DB/Models/User/User.model.js";

// Utils :
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
// Files ;
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";

// Validators
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";
import { roles } from "../../../DB/Models/User/Validation/User.validation.js";

// Register:
export const register = asnycHandler(async (req, res, next) => {
  // Admin :
  const role = req.body.email === "zsvber@gmail.com" ? roles.admin : roles.user;

  // If Avatar Existed :
  if (req.file) {
    const user = await User.create({
      ...req.body,
      role,
    });

    // File Uploading :
    await cloudUploader({
      req,
      folderType: folderTypes.avatar,
      userId: user._id,
    })
      .then(async (data) => {
        user.avatar = {
          public_id: data.public_id,
          secure_url: data.secure_url,
        };
        await user.save();
      })
      .catch((err) => {
        return errorResponse({ next }, { error: err.message, status: 500 });
      });

    return successResponse(
      { res },
      {
        msg: generateMessage("User").success.created.msg,
        status: 201,
        data: { user },
      }
    );
  }

  // If There Was No Avatar :
  const user = await User.create({
    ...req.body,
    role,
  });

  return successResponse(
    { res },
    {
      msg: generateMessage("User").success.created.msg,
      status: 201,
      data: { user },
    }
  );
});
