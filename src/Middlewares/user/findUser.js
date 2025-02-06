import User from "../../DB/Models/User.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const findUser = ({
  select = "",
  options = { projection, populate },
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { userID } = { ...req.params, ...req.query };
    const { error, status } = generateMessage("User").errors.notFound;
    const isExist = await User.findById(userID, projection, options).lean();

    if (!isExist) return errorResponse({ next }, { error, status });

    if (isExist.privateProfile) {
      const {
        fullName,
        userName,
        email,
        postsCount,
        viewrsCount,
        followersCount,
        followingCount,
      } = isExist;
      req,
        (searchedUser = {
          fullName,
          userName,
          email,
          postsCount,
          viewrsCount,
          followersCount,
          followingCount,
        });
      return next();
    }

    return next();
  });
};
