import Comment from "../../../DB/Models/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Get All Comment's Replies:
export const getCommentReplies = asnycHandler(async (req, res, next) => {
  const { commentId } = req.params;
  // GET All Comments From DataBase :
  const data = await Comment.find(
    { onComment: commentId },
    {},
    {
      populate: [{ path: "owner", select: "userName" }],
    }
  );

  return successResponse(
    { res },
    {
      ...((data.length == 0 && { msg: "No Replies Yet" }) || { msg: "Done" }),
      status: 200,
      ...(data.length && { data }),
    }
  );
});

// Get Single Reply:
export const getSingleReply = asnycHandler(async (req, res, next) => {
  return successResponse(
    { res },
    {
      msg: "Done",
      status: 200,
      data: req.reply,
    }
  );
});
