import User from "../../../DB/Models/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Get Other User's Own Profile Profile:
export const getUserProfile = asnycHandler((req, res, next) => {
  return successResponse(res, { data: req.searchedUser });
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

  return successResponse(res, { data: req.searchedUser });
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

  return successResponse(res, { data: req.searchedUser });
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

  return successResponse(res, {
    msg: generateMessage("User Following").success.msg,
    status: generateMessage("User Following").success.status,
    data: { updatedFollowing, followedUser },
  });
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

  return successResponse(res, {
    msg: generateMessage("User Following").success.msg,
    status: generateMessage("User Following").success.status,
    data: { updatedFollowing, followedUser },
  });
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

  return successResponse(res, {
    msg: generateMessage("User Block List").success.msg,
    status: generateMessage("User Block List").success.status,
    data: updatedBlockList,
  });
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

  return successResponse(res, {
    msg: generateMessage("User Block List").success.msg,
    status: generateMessage("User Block List").success.status,
    data: updatedBlockList,
  });
}); //✅
