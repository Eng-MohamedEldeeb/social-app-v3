import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

export const userFollowing = asnycHandler(async (req, res, next) => {
  // Followed User Id:
  const { _id: userId, requests, privateProfile } = req.searchedUser;

  // Profile Id:
  const { _id: profileID, following } = req.user;

  // If The Followed User Profile Is Private :
  if (privateProfile) {
    // Check If The User Already Requested To Follow User :
    const checkRequests = requests.some((req) => req.equals(profileID));

    const data = await User.findByIdAndUpdate(
      userId,
      {
        ...(checkRequests
          ? {
              $pull: { requests: profileID },
            }
          : {
              $addToSet: { requests: profileID },
            }),
      },
      { lean: true, new: true, projection: { requests: 1 } }
    );

    return successResponse(
      { res },
      {
        msg: generateMessage("User Following").success.msg,
        status: generateMessage("User Following").success.status,
        data,
      }
    );
  }

  // Check Profile Following List :
  const checkFollowing = following.some((user) => user.equals(userId));

  // Updating Followed User Followers List:
  const followedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...(checkFollowing
        ? {
            $pull: {
              followers: profileID,
            },
          }
        : {
            $addToSet: {
              followers: profileID,
            },
          }),
    },
    { lean: true, new: true, projection: { userName: 1, followers: 1 } }
  );

  // Updating Profile's Following List:
  const updatedFollowing = await User.findByIdAndUpdate(
    profileID,
    {
      ...(checkFollowing
        ? {
            $pull: {
              following: userId,
            },
          }
        : {
            $addToSet: {
              following: userId,
            },
          }),
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
