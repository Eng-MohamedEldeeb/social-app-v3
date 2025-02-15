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
  const { _id } = req.user;

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
  });

  const updatedUser = await User.findByIdAndUpdate(_id, {
    $push: {
      posts: data,
    },
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
