import Comment from "../../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import cloud from "../../../Utils/Upload/Cloudinary/Config/cloud.config.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Get All Posts:
export const getPostComments = asnycHandler(async (req, res, next) => {
  const { postID } = req.params;
  // GET All Comments From DataBase :
  const data = await Comment.find(
    { post: postID },
    { attachment: { public_id: 0 } },
    {
      populate: [{ path: "owner", select: "userName" }],
    }
  );

  return successResponse(
    { res },
    {
      ...((data.length == 0 && { msg: "No Comments Yet" }) || { msg: "Done" }),
      status: 200,
      ...(data.length && { data }),
    }
  );
});

// Get Single Post:
export const getSingleComment = asnycHandler(async (req, res, next) => {
  return successResponse(
    { res },
    {
      msg: "Done",
      status: 200,
      data: req.comment,
    }
  );
});

// Add Comment:
export const addComment = asnycHandler(async (req, res, next) => {
  // Owner Id:
  const { _id: userID } = req.user;
  // Post Id:
  const { _id: postID } = req.post;
  // Comment Data:
  const { content } = req.body;

  // Comment's Picture:
  let attachment = {};

  if (req.file) {
    const { public_id, secure_url } = await cloudUploader({
      req,
      userId: userID,
      folderType: folderTypes.comment,
    });
    attachment = { public_id, secure_url };
  }

  // Add Comment to DataBase
  const data = await Comment.create({
    content,
    owner: userID,
    post: postID,
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

// Edit Comment:
export const editComment = asnycHandler(async (req, res, next) => {
  // Updated Data :
  const { content } = req.body;

  // Comment's Id :
  const { commentID } = req.params;

  // Update Post :
  const data = await Comment.findByIdAndUpdate(
    commentID,
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

// Delete Comment:

export const deleteComment = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { commentID } = req.params;

  const { attachment } = req.comment;

  // Delete Comment :

  // If The Comment Have any Attachment:
  if (attachment.public_id) {
    const { result } = await cloud.uploader.destroy(attachment.public_id);

    if (result === "ok") {
      const data = await Comment.findByIdAndDelete(commentID);
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
  const data = await Comment.findByIdAndDelete(commentID);

  return successResponse(
    { res },
    {
      msg: generateMessage("Comment").success.deleted.msg,
      status: generateMessage("Comment").success.deleted.status,
      data,
    }
  );
});

// Un/Like Comment:
export const commentLike = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { commentID } = req.params;

  // Post's Like List :
  const { likedBy } = req.comment;

  // User's Id :
  const { _id } = req.user;

  // Check For Existed Like :
  const check = likedBy.some((id) => id.equals(_id));

  // Update Post's Likes :
  const data = await Comment.findByIdAndUpdate(
    commentID,
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
