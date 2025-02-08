import Comment from "../../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Get All Comment's Replies:
export const getCommentReplies = asnycHandler(async (req, res, next) => {
  const { commentID } = req.params;
  // GET All Comments From DataBase :
  const data = await Comment.find(
    { replyingTo: commentID },
    {},
    {
      populate: [{ path: "owner", select: "userName" }],
    }
  );

  return successResponse(res, {
    ...((data.length == 0 && { msg: "No Replies Yet" }) || { msg: "Done" }),
    status: 200,
    ...(data.length && { data }),
  });
});

// Get Single Reply:
export const getSingleReply = asnycHandler(async (req, res, next) => {
  return successResponse(res, {
    msg: "Done",
    status: 200,
    data: req.reply,
  });
});

// Add Reply:
export const addReply = asnycHandler(async (req, res, next) => {
  // Owner Id:
  const { _id: userID } = req.user;
  // Post Id:
  const { _id: postID } = req.post;
  // Comment Id:
  const { _id: replyID } = req.comment;
  // Comment Data:
  const { content } = req.body;

  // Add Reply to DataBase
  const data = await Comment.create({
    content,
    owner: userID,
    post: postID,
    replyingTo: replyID,
  });

  return successResponse(res, {
    msg: generateMessage("Reply").success.created.msg,
    status: generateMessage("Reply").success.created.status,
    data,
  });
});

// Edit Reply:
export const editReply = asnycHandler(async (req, res, next) => {
  // Updated Data :
  const { content } = req.body;

  // Comment's Id :
  const { replyID } = req.params;

  // Update Post :
  const data = await Comment.findOneAndUpdate(
    { replyingTo: replyID },
    { content },
    {
      projection: "content",
      new: true,
      lean: true,
    }
  );

  return successResponse(res, {
    msg: generateMessage("Reply").success.updated.msg,
    status: generateMessage("Reply").success.updated.status,
    data,
  });
});

// Delete Reply:

export const deleteReply = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { replyID } = req.params;

  // Delete Comment :
  const data = await Comment.findOneAndDelete({ replyingTo: replyID });

  return successResponse(res, {
    msg: generateMessage("Reply").success.deleted.msg,
    status: generateMessage("Reply").success.deleted.status,
    data,
  });
});

// Un/Like Reply:
export const replyLike = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { replyID } = req.params;

  // Reply's Like List :
  const { likedBy } = req.reply;

  // User's Id :
  const { _id } = req.user;

  // Check For Existed Like :
  const check = likedBy.some((id) => id.equals(_id));

  // Update Post's Likes :
  const data = await Comment.findOneAndUpdate(
    { replyingTo: replyID },
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
    msg: generateMessage("Reply").success.updated.msg,
    status: generateMessage("Reply").success.updated.status,
    data,
  });
});
