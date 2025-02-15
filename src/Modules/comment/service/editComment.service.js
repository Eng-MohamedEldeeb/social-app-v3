import Comment from "../../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Edit Comment:
export const editComment = asnycHandler(async (req, res, next) => {
  // Updated Data :
  const { content } = req.body;

  // Comment's Id :
  const { commentId } = req.params;

  // Update Post :
  const data = await Comment.findByIdAndUpdate(
    commentId,
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
      msg: generateMessage("Comment").success.updated.msg,
      status: generateMessage("Comment").success.updated.status,
      data,
    }
  );
});
