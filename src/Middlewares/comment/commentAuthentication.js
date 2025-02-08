import Comment from "../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const commentAuthentication = ({
  select = "",
  options = { projection, populate },
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { commentID } = { ...req.params, ...req.query };

    // Search For The Requseted Comment :
    const commentData = await Comment.findById(commentID, select, options);

    //! If The Post Wasn't Found :
    if (!commentData)
      return errorResponse(
        { next },
        {
          error: generateMessage("Post").errors.notFound.error,
          status: generateMessage("Post").errors.notFound.status,
        }
      );

    req.comment = commentData;
    return next();
  });
};
