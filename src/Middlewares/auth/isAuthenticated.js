import { Types } from "mongoose";
import User from "../../DB/Models/User.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";
import { decryptValue } from "../../Utils/Security/hash.js";

export const isAuthenticated = ({
  select = "",
  options = { projection, populate },
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { _id, userName, email, userID } = {
      ...req.body,
      ...req.query,
      ...req.token,
    };
    let user;

    if (
      (userID && Types.ObjectId.isValid(userID)) ||
      (_id && Types.ObjectId.isValid(_id))
    )
      user = await User.findById(_id || userID, select, options).lean();

    if (userName || email)
      user = await User.findOne(
        { $or: [{ email }, { userName }] },
        select,
        options
      ).lean();

    if (!user) {
      const { error, status } = generateMessage("User").errors.notFound;
      return errorResponse(
        { next },
        {
          error,
          status,
        }
      );
    }

    if (req.token && req.token.iat < user.passwordChangedAt?.getTime() / 1000) {
      const { error, status } = generateMessage().errors.expiredToken;
      return errorResponse({ next }, { error, status });
    }

    req.user = {
      ...user,
      ...(user.phone && { phone: decryptValue({ payload: user.phone }) }),
    };

    return next();
  });
};
