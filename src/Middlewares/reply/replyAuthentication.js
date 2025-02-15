import Comment from "../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const replyAuthentication = ({
  select = "",
  options = { projection, populate },
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { replyID } = { ...req.params, ...req.query };

    // Search For The Requseted Reply :
    const replyData = await Comment.findOne(
      { onComment: replyID },
      select,
      options
    );

    //! If The Reply Wasn't Found :
    if (!replyData)
      return errorResponse(
        { next },
        {
          error: generateMessage("Reply").errors.notFound.error,
          status: generateMessage("Reply").errors.notFound.status,
        }
      );

    req.reply = replyData;
    return next();
  });
};
