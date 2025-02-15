import { roles } from "../../DB/Models/User/Validation/User.validation.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";

export const commentAuthorization = asnycHandler((req, res, next) => {
  // Users's Data
  const { _id, role } = req.user;

  // Post's Data :
  const { owner } = req.comment;

  //! If The User Aren't The Comment's Owner nor Admin :
  if (!owner.equals(_id) || (role != roles.admin && !owner.equals(_id)))
    return errorResponse(
      { next },
      {
        error: generateMessage("Comment").errors.notTheOwner.error,
        status: generateMessage("Comment").errors.notTheOwner.status,
      }
    );
  return next();
});
