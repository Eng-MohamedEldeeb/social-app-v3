import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const groupAuthorization = asnycHandler((req, res, next) => {
  // User Data :
  const { _id } = req.user;

  // Group Data :
  const { creator, admins } = req.group;

  //! Check If The Requested User Is Not Admin:
  if (
    !creator.equals(_id) ||
    (!creator.equals(_id) && !admins.some((admin) => admin.equals(_id)))
  )
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.notAllowed.error,
        status: 403,
      }
    );

  return next();
});
