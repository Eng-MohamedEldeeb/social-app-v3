import Post from "../../../DB/Models/Post/Post.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Edit Post:
export const editPost = asnycHandler(async (req, res, next) => {
  // Updated Data :
  const updatedData = req.body;

  // Post's Id :
  const { postId } = req.params;

  // Update Post :
  const data = await Post.findByIdAndUpdate(postId, updatedData, {
    projection: `${Object.keys(updatedData).join(" ")}`,
    new: true,
    lean: true,
  });

  return successResponse(
    { res },
    {
      msg: generateMessage("Post").success.updated.msg,
      status: generateMessage("Post").success.updated.status,
      data,
    }
  );
});
