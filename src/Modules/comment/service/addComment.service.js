import Comment from "../../../DB/Models/Comment/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Add Comment:
export const addComment = asnycHandler(async (req, res, next) => {
  // Owner Id:
  const { _id: userId } = req.user;
  // Post Id:
  const { _id: postId } = req.post;
  // Comment Data:
  const { content } = req.body;

  // Comment's Picture:
  let attachment = {};

  if (req.file) {
    const { public_id, secure_url } = await cloudUploader({
      req,
      userId: userId,
      folderType: folderTypes.comment,
    });
    attachment = { public_id, secure_url };
  }

  // Add Comment to DataBase
  const data = await Comment.create({
    content,
    owner: userId,
    onPost: postId,
    ...(attachment.public_id && { attachment }),
  });

  return successResponse(
    { res },
    {
      msg: generateMessage("Comment").success.created.msg,
      status: generateMessage("Comment").success.created.status,
      data,
    }
  );
});
