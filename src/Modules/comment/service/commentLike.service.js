import Comment from "../../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Un/Like Comment:
export const commentLike = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { commentId } = req.params;

  // Post's Like List :
  const { likedBy } = req.comment;

  // User's Id :
  const { _id } = req.user;

  // Check For Existed Like :
  const check = likedBy.some((id) => id.equals(_id));

  // Update Post's Likes :
  const data = await Comment.findByIdAndUpdate(
    commentId,
    {
      ...(check
        ? { $pull: { likedBy: _id } }
        : {
            $addToSet: { likedBy: _id },
          }),
    },
    { new: true, lean: true, projection: { likedBy: 1 } }
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
