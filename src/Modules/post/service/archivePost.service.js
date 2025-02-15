import Post from "../../../DB/Models/Post.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Archive Post:
export const archivePost = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { postId } = req.params;

  // Delete Post :
  const data = await Post.findByIdAndUpdate(
    postId,
    { isArchived: true },
    {
      projection: { isArchived: 1 },
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
