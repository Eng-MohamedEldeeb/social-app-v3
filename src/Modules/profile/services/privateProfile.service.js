import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

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

  return successResponse(
    { res },
    {
      msg: generateMessage("User Profile").success.msg,
      status: generateMessage("User Profile").success.status,
      data: updateProfile,
    }
  );
}); //✅
