import Group from "../../../../DB/Models/Group/Group.model.js";
import User from "../../../../DB/Models/User/User.model.js";

import { asnycHandler } from "../../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../../Utils/Res/success.response.js";
import { errorResponse } from "../../../../Utils/Res/error.response.js";

export const addAdmin = asnycHandler(async (req, res, next) => {
  // Group Info :
  const { id } = req.params;

  // Requested Admin Id :
  const { user } = req.body;

  // Check For Admins Existence :
  const userData = await User.findOneAndUpdate(
    {
      _id: user,
      isDeactivated: { $exists: false },
    },
    {
      $addToSet: { joinedGroups: id },
    },
    { lean: true, new: true, projection: { joinedGroups: 1 } }
  );

  //! If The Requested User Wasn't Found And Wasn't Found :
  if (!userData)
    return errorResponse(
      { next },
      {
        error: generateMessage("User").errors.notFound.error,
        status: 404,
      }
    );

  if (
    req.user._id.equals(user) ||
    !req.group.admins.some((admin) => admin.equals(req.user._id))
  )
    return errorResponse(
      { next },
      { error: generateMessage().errors.notAllowed.error, status: 403 }
    );

  // Group Admins List Update :
  const data = await Group.findByIdAndUpdate(
    id,
    {
      $addToSet: { admins: user },
    },
    { lean: true, new: true, projection: "admins" }
  );

  //! If The Group Wasn't Found And Wasn't Updated :
  if (!data)
    return errorResponse(
      { next },
      {
        error: generateMessage("Group").errors.notFound.error,
        status: 404,
      }
    );

  return successResponse(
    { res },
    {
      msg: generateMessage("Group").success.updated.msg,
      status: 201,
      data: { data, userData },
    }
  );
});
