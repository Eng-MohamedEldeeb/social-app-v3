import { roles } from "../../DB/Options/field.validation.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";

export const postAuthorization = asnycHandler((req, res, next) => {
  // Users's Data
  const { _id, role } = req.user;

  // Post's Data :
  const { owner } = req.post;

  //! If The User Aren't The Post's Owner nor Admin :
  if (!owner.equals(_id) || (role != roles.admin && !owner.equals(_id)))
    return errorResponse(
      { next },
      {
        error: generateMessage("Post").errors.notTheOwner.error,
        status: generateMessage("Post").errors.notTheOwner.status,
      }
    );
  return next();
});
