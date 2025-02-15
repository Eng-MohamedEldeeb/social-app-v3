import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

export const deactivateAccount = asnycHandler(async (req, res, next) => {
  // User Data :
  const { _id } = req.user;

  // Update User's Profile Pivacy :
  const updateProfile = await User.findByIdAndUpdate(
    _id,
    { isDeactivated: true },
    { lean: true, new: true, projection: "isDeactivated" }
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
