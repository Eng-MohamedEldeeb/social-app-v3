import User from "../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const userAuthentication = ({
  select = "",
  options = { projection, populate },
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { userID } = { ...req.params, ...req.query };
    const user = await User.findById({ _id: userID }, select, options).lean();

    //! If The User Wasn't Found:
    if (!user)
      return errorResponse(
        { next },
        {
          error: generateMessage("User").errors.notFound.error,
          status: generateMessage("User").errors.notFound.status,
        }
      );
    console.log();

    //! If The User Was In The Block List:
    if (
      user.blockList.some((blockedUser) => blockedUser.equals(req.user._id)) ||
      req.user.blockList.some((blockedUser) => blockedUser.equals(user._id))
    )
      return errorResponse(
        { next },
        {
          error: generateMessage("User").errors.notFound.error,
          status: generateMessage("User").errors.notFound.status,
        }
      );

    //! If The User's Account Was Deactivated:
    if (user.isDeactivated)
      return errorResponse(
        { next },
        {
          error: generateMessage("User").errors.notFound.error,
          status: generateMessage("User").errors.notFound.status,
        }
      );

    //? If The User's Profile Is Private:
    if (user.privateProfile) {
      const {
        // fullName,
        userName,
        profilePicture,
        privateProfile,
        followers,
        following,
      } = user;
      req.searchedUser = {
        userName,
        profilePicture,
        privateProfile,
        followers: followers.length,
        following: following.length,
      };
      return next();
    }
    const { blockList, ...rest } = user;
    req.searchedUser = rest;
    return next();
  });
};
