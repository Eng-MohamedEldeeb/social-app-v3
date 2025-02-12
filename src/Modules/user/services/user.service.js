import Group from "../../../DB/Models/Group/Group.model.js";
import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Get Other User's Own Profile Profile:
export const getUserProfile = asnycHandler((req, res, next) => {
  return successResponse({ res }, { data: req.searchedUser });
}); //✅

// Get Other User's Own Profile Followers:
export const getUserFollowers = asnycHandler((req, res, next) => {
  const { privateProfile } = req.searchedUser;

  //! If The Requseted Profile Is Private:
  if (privateProfile)
    return errorResponse(
      { next },
      {
        error: generateMessage("Profile").errors.private.error,
        status: generateMessage("Profile").errors.private.status,
      }
    );

  return successResponse({ res }, { data: req.searchedUser });
}); //✅

// Get Other User's Own Profile Following:
export const getUserFollowing = asnycHandler((req, res, next) => {
  const { privateProfile } = req.searchedUser;

  //! If The Requseted Profile Is Private:
  if (privateProfile)
    return errorResponse(
      { next },
      {
        error: generateMessage("Profile").errors.private.error,
        status: generateMessage("Profile").errors.private.status,
      }
    );

  return successResponse({ res }, { data: req.searchedUser });
}); //✅

export const followUser = asnycHandler(async (req, res, next) => {
  // Followed User Id:
  const { userID } = req.params;

  // Profile Id:
  const { _id: profileID } = req.user;

  // Updating Followed User Followers List:
  const followedUser = await User.findOneAndUpdate(
    { _id: userID, isDeactivated: { $exists: false } },
    {
      $addToSet: {
        followers: profileID,
      },
    },
    { lean: true, new: true, projection: { userName: 1, followers: 1 } }
  );

  //! If The Followed User Wasn't Found:
  if (!followedUser)
    return errorResponse(
      { next },
      {
        error: generateMessage("User").errors.notFound.error,
        status: generateMessage("User").errors.notFound.status,
      }
    );

  // Updating Profile's Following List:
  const updatedFollowing = await User.findOneAndUpdate(
    { _id: profileID, isDeactivated: { $exists: false } },
    {
      $addToSet: {
        following: userID,
      },
    },
    { lean: true, new: true, projection: { userName: 1, following: 1 } }
  );

  return successResponse(
    { res },
    {
      msg: generateMessage("User Following").success.msg,
      status: generateMessage("User Following").success.status,
      data: { updatedFollowing, followedUser },
    }
  );
}); //✅

export const unfollowUser = asnycHandler(async (req, res, next) => {
  const { userID } = req.params;
  const { _id: profileID } = req.user;
  const followedUser = await User.findOneAndUpdate(
    { _id: userID, isDeactivated: { $exists: false } },
    {
      $pull: {
        followers: profileID,
      },
    },
    { lean: true, new: true, projection: { userName: 1, followers: 1 } }
  );

  if (!followedUser)
    return errorResponse(
      { next },
      {
        error: generateMessage("User").errors.notFound.error,
        status: generateMessage("User").errors.notFound.status,
      }
    );

  const updatedFollowing = await User.findOneAndUpdate(
    { _id: profileID, isDeactivated: { $exists: false } },
    {
      $pull: {
        following: userID,
      },
    },
    { lean: true, new: true, projection: { userName: 1, following: 1 } }
  );

  if (!updatedFollowing)
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
      msg: generateMessage("User Following").success.msg,
      status: generateMessage("User Following").success.status,
      data: { updatedFollowing, followedUser },
    }
  );
}); //✅

export const blockUser = asnycHandler(async (req, res, next) => {
  const { userID } = req.params;
  const { _id: profileID } = req.user;
  const blockedUser = await User.findOne({
    _id: userID,
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
        blockList: userID,
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
  const { userID } = req.params;
  const { _id: profileID } = req.user;
  const blockedUser = await User.findOne({
    _id: userID,
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
        blockList: userID,
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
