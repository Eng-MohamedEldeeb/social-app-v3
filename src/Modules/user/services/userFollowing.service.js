import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

export const followUser = asnycHandler(async (req, res, next) => {
  // Followed User Id:
  const { userId } = req.params;

  // Profile Id:
  const { _id: profileID } = req.user;

// Followed User Data :
const searchedUser = req.searchedUser

// If The Followed User Profile Is Private :
if(searchedUser.isPrivate){/* logic*/}

  // Updating Followed User Followers List:
  const followedUser = await User.findOneAndUpdate(
    { _id: userId, isDeactivated: { $exists: false } },
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
        following: userId,
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
  const { userId } = req.params;
  const { _id: profileID } = req.user;
  const followedUser = await User.findOneAndUpdate(
    { _id: userId, isDeactivated: { $exists: false } },
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
        following: userId,
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
