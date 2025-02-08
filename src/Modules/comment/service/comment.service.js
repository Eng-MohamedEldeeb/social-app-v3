import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Get All Posts:
export const getAllComments = asnycHandler(async (req, res, next) => {
  // GET All Comments From DataBase :
  const data = await Comment.find();

  return successResponse(res, {
    ...((data.length == 0 && { msg: "No Comments Yet" }) || { msg: "Done" }),
    status: 200,
    ...(data.length && { data }),
  });
});

// Get Single Post:
export const getSingleComment = asnycHandler(async (req, res, next) => {
  return successResponse(res, {
    msg: "Done",
    status: 200,
    data: req.comment,
  });
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
  let commentPic = {};

  if (req.file) {
    const { public_id, secure_url } = await cloudUploader({
      req,
      userId: _id,
      folderType: folderTypes.post,
    });
    commentPic = { public_id, secure_url };
  }

  // Add opmment to DataBase
  const data = await Comment.create({
    content,
    owner: userID,
    post: postID,
    ...(commentPic.public_id && { postPicture: commentPic }),
  });

  return successResponse(res, {
    msg: generateMessage("Comment").success.created.msg,
    status: generateMessage("Comment").success.created.status,
    data,
  });
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

  return successResponse(res, {
    msg: generateMessage("Comment").success.updated.msg,
    status: generateMessage("Comment").success.updated.status,
    data,
  });
});

// Delete Comment:

export const deleteComment = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { commentID } = req.params;

  // Delete Comment :
  const data = await Comment.findByIdAndDelete(commentID);

  return successResponse(res, {
    msg: generateMessage("Comment").success.deleted.msg,
    status: generateMessage("Comment").success.deleted.status,
    data,
  });
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
  return successResponse(res, {
    msg: generateMessage("Comment").success.updated.msg,
    status: generateMessage("Comment").success.updated.status,
    data,
  });
});
