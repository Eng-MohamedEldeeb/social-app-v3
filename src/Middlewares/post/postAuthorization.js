import { roles } from "../../DB/Options/field.validation.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";

export const postAuthorization = asnycHandler((req, res, next) => {
  // Users's Data
  const { _id, role } = req.user;

  // Post's Data :
  const { owner, allowComments } = req.post;

  //! If The User Aren't The Post's Owner nor Admin :
  if (!owner.equals(_id) || (role != roles.admin && !owner.equals(_id)))
    return errorResponse(
      { next },
      {
        error: generateMessage("Post").errors.notTheOwner.error,
        status: generateMessage("Post").errors.notTheOwner.status,
      }
    );

  //! If The Comment Wasn't Allowing For Comments :
  if (!allowComments)
    return errorResponse(
      { next },
      {
        error: generateMessage("Comment").errors.notAllowed.error,
        status: generateMessage("Comment").errors.notAllowed.status,
      }
    );
  return next();
});
