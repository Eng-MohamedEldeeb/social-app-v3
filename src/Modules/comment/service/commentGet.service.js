import Comment from "../../../DB/Models/Comment/Comment.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Get All Posts:
export const getPostComments = asnycHandler(async (req, res, next) => {
  const { postId } = req.params;
  // GET All Comments From DataBase :
  const data = await Comment.find(
    { post: postId },
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
