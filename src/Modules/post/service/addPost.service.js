import Post from "../../../DB/Models/Post/Post.model.js";
import User from "../../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Add Post:
export const addPost = asnycHandler(async (req, res, next) => {
  // Owner Id:
  const { _id, joinedGroups } = req.user;

  // Group Id :
  const { groupId } = req.params;

  if (groupId && !joinedGroups.some((group) => group.equals(groupId)))
    return errorResponse(
      { next },
      { error: "Can't Post On Group You Are Not Joined", status: 400 }
    );

  // Post Data:
  const postData = req.body;

  if (req.file) {
    const upload = cloudUploader({
      req,
      userId: _id,
      folderType: folderTypes.post,
    })
      .then(async (pic) => {
        const data = await Post.create({
          ...postData,
          owner: _id,
          attachment: { public_id: pic.public_id, secure_url: pic.secure_url },
          onGroup: groupId,
        });

        return successResponse(
          { res },
          {
            msg: generateMessage("Post").success.created.msg,
            status: generateMessage("Post").success.created.status,
            data,
          }
        );
      })
      .catch((err) => {
        return errorResponse({ next }, { error: err.message, status: 500 });
      });
  }

  // Add Post to DataBase if there was no attachment
  const data = await Post.create({
    ...postData,
    owner: _id,
    onGroup: groupId,
  });

  return successResponse(
    { res },
    {
      msg: generateMessage("Post").success.created.msg,
      status: generateMessage("Post").success.created.status,
      data,
    }
  );
});
