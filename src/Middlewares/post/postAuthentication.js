import { log } from "node:console";
import Post from "../../DB/Models/Post.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const postAuthentication = ({
  select = {
    attachment: {
      public_id: 0,
    },
  },
  options = { projection, populate },
  archivedField = false,
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { postID } = { ...req.params, ...req.query };

    // Search For The Requseted Post :
    const postData = await Post.findOne(
      { _id: postID, isArchived: { $exists: archivedField } },
      select,
      options
    );

    //! If The Post Wasn't Found :
    if (!postData)
      return errorResponse(
        { next },
        {
          error: generateMessage("Post").errors.notFound.error,
          status: generateMessage("Post").errors.notFound.status,
        }
      );

    req.post = postData;
    return next();
  });
};
