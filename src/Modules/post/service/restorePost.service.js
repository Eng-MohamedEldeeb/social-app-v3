import Post from "../../../DB/Models/Post.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Restore Post:
export const restorePost = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { postId } = req.params;

  // Delete Post :
  const data = await Post.findOneAndUpdate(
    { _id: postId, isArchived: { $exists: true } },
    { $unset: { isArchived: 1 } },
    {
      projection: "_id",
      new: true,
      lean: true,
    }
  );

  return successResponse(
    { res },
    {
      msg: generateMessage("Post").success.deleted.msg,
      status: generateMessage("Post").success.deleted.status,
      data,
    }
  );
});
