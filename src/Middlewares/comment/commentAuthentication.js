import Comment from "../../DB/Models/Comment/Comment.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const commentAuthentication = ({
  select = "",
  options = { projection, populate },
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { commentId } = { ...req.params, ...req.query };

    // Search For The Requseted Comment :
    const commentData = await Comment.findById(commentId, select, options);
    console.log(commentData);

    //! If The Comment Wasn't Found :
    if (!commentData)
      return errorResponse(
        { next },
        {
          error: generateMessage("Comment").errors.notFound.error,
          status: generateMessage("Comment").errors.notFound.status,
        }
      );

    req.comment = commentData;
    return next();
  });
};
