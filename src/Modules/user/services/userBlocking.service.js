import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

export const blockUser = asnycHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { _id: profileID } = req.user;
  const blockedUser = await User.findOne({
    _id: userId,
    isDeactivated: { $exists: false },
  });

  if (!blockedUser)
    return errorResponse(
      { next },
      {
        error: generateMessage("User").errors.notFound.error,
        status: generateMessage("User").errors.notFound.status,
      }
    );

  const updatedBlockList = await User.findOneAndUpdate(
    { _id: profileID, isDeactivated: { $exists: false } },
    {
      $addToSet: {
        blockList: userId,
      },
    },
    { lean: true, new: true, projection: { userName: 1, blockList: 1 } }
  );

  if (!updatedBlockList)
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
      msg: generateMessage("User Block List").success.msg,
      status: generateMessage("User Block List").success.status,
      data: updatedBlockList,
    }
  );
}); //✅

export const unblockUser = asnycHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { _id: profileID } = req.user;
  const blockedUser = await User.findOne({
    _id: userId,
    isDeactivated: { $exists: false },
  });

  if (!blockedUser)
    return errorResponse(
      { next },
      {
        error: generateMessage("User").errors.notFound.error,
        status: generateMessage("User").errors.notFound.status,
      }
    );

  const updatedBlockList = await User.findOneAndUpdate(
    { _id: profileID, isDeactivated: { $exists: false } },
    {
      $pull: {
        blockList: userId,
      },
    },
    { lean: true, new: true, projection: { userName: 1, blockList: 1 } }
  );

  if (!updatedBlockList)
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
      msg: generateMessage("User Block List").success.msg,
      status: generateMessage("User Block List").success.status,
      data: updatedBlockList,
    }
  );
}); //✅
