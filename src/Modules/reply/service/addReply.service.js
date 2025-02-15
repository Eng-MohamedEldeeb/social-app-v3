import Comment from "../../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Add Reply:
export const addReply = asnycHandler(async (req, res, next) => {
  // Owner Id:
  const { _id: userId } = req.user;
  // Post Id:
  const { _id: postId } = req.post;
  // Comment Id:
  const { _id: replyID } = req.comment;
  // Comment Data:
  const { content } = req.body;

  // Add Reply to DataBase
  const data = await Comment.create({
    content,
    owner: userId,
    post: postId,
    onComment: replyID,
  });

  return successResponse(
    { res },
    {
      msg: generateMessage("Reply").success.created.msg,
      status: generateMessage("Reply").success.created.status,
      data,
    }
  );
});
