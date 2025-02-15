import Post from "../../../DB/Models/Post.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Un/Like Post:
export const postLike = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { postId } = req.params;

  // Post's Like List :
  const { likedBy } = req.post;

  // User's Id :
  const { _id } = req.user;

  // Check For Existed Like :
  const check = likedBy.some((id) => id.equals(_id));

  // Update Post's Likes :
  const data = await Post.findByIdAndUpdate(
    postId,
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
      msg: generateMessage("Post").success.updated.msg,
      status: generateMessage("Post").success.updated.status,
      data,
    }
  );
});
