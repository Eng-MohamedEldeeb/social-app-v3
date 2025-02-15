import Comment from "../../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Delete Reply:
export const deleteReply = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { replyID } = req.params;

  // Delete Comment :
  const data = await Comment.findOneAndDelete({ onComment: replyID });

  return successResponse(
    { res },
    {
      msg: generateMessage("Reply").success.deleted.msg,
      status: generateMessage("Reply").success.deleted.status,
      data,
    }
  );
});
