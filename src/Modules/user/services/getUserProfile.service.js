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
