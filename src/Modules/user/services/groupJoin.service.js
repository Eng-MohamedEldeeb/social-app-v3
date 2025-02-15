import Group from "../../../DB/Models/Group/Group.model.js";
import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

export const groupJoin = asnycHandler(async (req, res, next) => {
  // Group Id :
  const { id: groupId } = req.params;

  // User Data :
  const { _id: userId } = req.user;

  // Group Data :
  const { creator, members, admins } = req.group;

  // Check If The User Was The Group Creator :
  //! If The User Was The Creator :
  if (creator.equals(userId))
    return errorResponse(
      { next },
      {
        error: "Group Creator Can't Join His Created Group",
        status: 400,
      }
    );

  // Check The User Existence In The Group Admins List ;
  const checkAdmins = admins.some((admin) => admin.equals(userId));

  //! If The User Was Already In Group Admins List :
  if (checkAdmins)
    return errorResponse(
      { next },
      {
        error: "User Is Already Admin In This Group, Can't Be A Member",
        status: 400,
      }
    );

  // Check The User Existence In The Group Members List ;
  const checkMembers = members.some((member) => member.equals(userId));

  const data = await Group.findByIdAndUpdate(
    groupId,
    {
      ...(checkMembers
        ? { $pull: { members: userId } }
        : { $addToSet: { members: userId } }),
    },
    { lean: true, new: true, projection: { members: 1 } }
  );

  //! If The Group Wasn't Found :
  if (!data)
    return errorResponse(
      { next },
      { error: generateMessage("Group").errors.notFound.error, status: 404 }
    );

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, isDeactivated: { $exists: false } },
    {
      ...(checkMembers
        ? { $pull: { joinedGroups: groupId } }
        : { $addToSet: { joinedGroups: groupId } }),
    },
    { new: true, lean: true, projection: { joinedGroups: 1 } }
  );

  //! If The User Wasn't Found :
  if (!updatedUser)
    return errorResponse(
      { next },
      { error: generateMessage("User").errors.notFound.error, status: 404 }
    );

  return successResponse(
    { res },
    { msg: "done", status: 200, data: { data, updatedUser } }
  );
}); //✅
