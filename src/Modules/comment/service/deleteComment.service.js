import Comment from "../../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import cloud from "../../../Utils/Upload/Cloudinary/Config/cloud.config.js";

// Delete Comment:

export const deleteComment = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { commentId } = req.params;

  const { attachment } = req.comment;

  // Delete Comment :

  // If The Comment Have any Attachment:
  if (attachment.public_id) {
    const { result } = await cloud.uploader.destroy(attachment.public_id);

    if (result === "ok") {
      const data = await Comment.findByIdAndDelete(commentId);
      return successResponse(
        { res },
        {
          msg: generateMessage("Comment").success.deleted.msg,
          status: generateMessage("Comment").success.deleted.status,
          data,
        }
      );
    } else {
      return errorResponse(
        { next },
        {
          error: generateMessage("Comment's Attachment").errors.notFound.error,
          status: generateMessage("Comment's Attachment").errors.notFound
            .status,
        }
      );
    }
  }

  // If The Comment Doesn't Have any Attachment:
  const data = await Comment.findByIdAndDelete(commentId);

  return successResponse(
    { res },
    {
      msg: generateMessage("Comment").success.deleted.msg,
      status: generateMessage("Comment").success.deleted.status,
      data,
    }
  );
});
