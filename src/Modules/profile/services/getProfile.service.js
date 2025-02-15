import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Get User's Own Profile:
export const getProfile = asnycHandler(async (req, res, next) => {
  return successResponse({ res }, { data: req.user });
}); //✅

// Get User's Own Profile Following:
export const getProfileFollowing = asnycHandler((req, res, next) => {
  return successResponse({ res }, { data: req.user });
}); //✅

// Get User's Own Profile Followers:
export const getProfileFollowers = asnycHandler((req, res, next) => {
  return successResponse({ res }, { data: req.user });
}); //✅
