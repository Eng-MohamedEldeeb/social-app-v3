import User from "../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";
import { decryptValue } from "../../Utils/Security/hash.js";

export const isAuthenticated = ({ select = "", options = {} } = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { _id } = req.token;

    const user = await User.findById(_id, select, options).lean();

    //! If The User Wasn't Found:
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

    //! If The User's Account Was Deactivated:
    if (user.isDeactivated)
      return errorResponse(
        { next },
        {
          error: generateMessage().errors.unAuthenticated.error,
          status: generateMessage().errors.unAuthenticated.status,
        }
      );

    //! If The Token Was Expired:
    if (
      req.token &&
      (req.token.iat < user.passwordChangedAt?.getTime() / 1000 ||
        req.token.iat < user.emailChangedAt?.getTime() / 1000)
    ) {
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
