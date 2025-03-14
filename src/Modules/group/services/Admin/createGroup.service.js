import Group from "../../../../DB/Models/Group/Group.model.js";
import User from "../../../../DB/Models/User/User.model.js";
import { roles } from "../../../../DB/Models/User/Validation/User.validation.js";
import { asnycHandler } from "../../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../../Utils/Res/success.response.js";

export const createGroup = asnycHandler(async (req, res, next) => {
  // Group Info:
  const groupData = req.body;

  // User Role:
  const { role } = req.user;

  //! Check If The Requested User Is Not Admin:
  if (role != roles.admin)
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.notAllowed.error,
        status: 403,
      }
    );

  // If The User Was Allowed To Create a Group:
  const data = await Group.create({
    ...groupData,
    creator: req.user._id,
  });

  // Update Admin's Creatod Groups :
  const adminUpdate = await User.findOneAndUpdate(
    { _id: req.user._id, isDeactivated: { $exists: false } },
    { $push: { createdGroups: data._id } },
    { lean: true, new: true, projection: { createdGroups: 1 } }
  );

  return successResponse(
    { res },
    {
      msg: generateMessage("Group").success.created.msg,
      status: 201,
      data: { group: data, adminUpdate },
    }
  );
});
