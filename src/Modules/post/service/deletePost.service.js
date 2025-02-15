import Post from "../../../DB/Models/Post.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import cloud from "../../../Utils/Upload/Cloudinary/Config/cloud.config.js";

// Delete Post:
export const deletePost = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { postId } = req.params;
  // Post's Attachment
  const { attachment } = req.post;

  // Delete Post :

  // If The Post Have any Attachment:
  if (attachment.public_id) {
    const { result } = await cloud.uploader.destroy(attachment.public_id);

    if (result === "ok") {
      const data = await Post.findByIdAndDelete(postId);
      return successResponse(
        { res },
        {
          msg: generateMessage("Post").success.deleted.msg,
          status: generateMessage("Post").success.deleted.status,
          data,
        }
      );
    } else {
      return errorResponse(
        { next },
        {
          error: generateMessage("Post's Attachment").errors.notFound.error,
          status: generateMessage("Post's Attachment").errors.notFound.status,
        }
      );
    }
  }
  // If The Post Doesn't Have any Attachment:
  const data = await Post.findByIdAndDelete(postId);

  return successResponse(
    { res },
    {
      msg: generateMessage("Post").success.deleted.msg,
      status: generateMessage("Post").success.deleted.status,
      data,
    }
  );
});
