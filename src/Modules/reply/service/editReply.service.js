import Comment from "../../../DB/Models/Comment/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Edit Reply:
export const editReply = asnycHandler(async (req, res, next) => {
  // Updated Data :
  const { content } = req.body;

  // Comment's Id :
  const { replyID } = req.params;

  // Update Post :
  const data = await Comment.findOneAndUpdate(
    { onComment: replyID },
    { content },
    {
      projection: "content",
      new: true,
      lean: true,
    }
  );

  return successResponse(
    { res },
    {
      msg: generateMessage("Reply").success.updated.msg,
      status: generateMessage("Reply").success.updated.status,
      data,
    }
  );
});
