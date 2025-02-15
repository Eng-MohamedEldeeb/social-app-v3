import Post from "../../../DB/Models/Post.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Get All Posts:
export const getAllPosts = asnycHandler(async (req, res, next) => {
  // GET All Posts From DataBase:
  const data = await Post.find(
    { isArchived: { $exists: false } },
    {
      attachment: {
        public_id: 0,
      },
    },
    { lean: true }
  );

  return successResponse(
    { res },
    {
      msg: "Done",
      status: 200,
      ...((data.length && { data }) || { data: "No Posts Yet" }),
    }
  );
});

// Get Single Post:
export const getSinglePost = asnycHandler(async (req, res, next) => {
  return successResponse(
    { res },
    {
      msg: "Done",
      status: 200,
      data: req.post,
    }
  );
});
