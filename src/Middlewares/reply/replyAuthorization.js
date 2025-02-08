import { roles } from "../../DB/Options/field.validation.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";

export const replyAuthorization = asnycHandler((req, res, next) => {
  // Users's Data
  const { _id, role } = req.user;

  // Post's Data :
  const { owner } = req.reply;

  //! If The User Aren't The Reply's Owner nor Admin :
  if (!owner.equals(_id) || (role != roles.admin && !owner.equals(_id)))
    return errorResponse(
      { next },
      {
        error: generateMessage("Reply").errors.notTheOwner.error,
        status: generateMessage("Reply").errors.notTheOwner.status,
      }
    );
  return next();
});
