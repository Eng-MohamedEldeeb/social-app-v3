import Post from "../../../DB/Models/Post.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

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

  return successResponse(res, {
    ...((data.length == 0 && { msg: "No Posts Yet" }) || { msg: "Done" }),
    status: 200,
    ...(data.length && { data }),
  });
});

// Get Single Post:
export const getSinglePost = asnycHandler(async (req, res, next) => {
  return successResponse(res, {
    msg: "Done",
    status: 200,
    data: req.post,
  });
});

// Add Post:
export const addPost = asnycHandler(async (req, res, next) => {
  // Owner Id:
  const { _id } = req.user;

  // Post Data:
  const postData = req.body;

  // Post's Picture:
  let attachment = {};

  if (req.file) {
    const { public_id, secure_url } = await cloudUploader({
      req,
      userId: _id,
      folderType: folderTypes.post,
    });
    attachment = { public_id, secure_url };
  }

  // Add Post to DataBase
  const data = await Post.create({
    ...postData,
    owner: _id,
    ...(attachment.public_id && { attachment }),
  });

  return successResponse(res, {
    msg: generateMessage("Post").success.created.msg,
    status: generateMessage("Post").success.created.status,
    data,
  });
});

// Edit Post:
export const editPost = asnycHandler(async (req, res, next) => {
  // Updated Data :
  const updatedData = req.body;

  // Post's Id :
  const { postID } = req.params;

  // Update Post :
  const data = await Post.findByIdAndUpdate(postID, updatedData, {
    projection: `${Object.keys(updatedData).join(" ")}`,
    new: true,
    lean: true,
  });

  return successResponse(res, {
    msg: generateMessage("Post").success.updated.msg,
    status: generateMessage("Post").success.updated.status,
    data,
  });
});

// Archive Post:
export const archivePost = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { postID } = req.params;

  // Delete Post :
  const data = await Post.findByIdAndUpdate(
    postID,
    { isArchived: true },
    {
      projection: { isArchived: 1 },
      new: true,
      lean: true,
    }
  );

  return successResponse(res, {
    msg: generateMessage("Post").success.deleted.msg,
    status: generateMessage("Post").success.deleted.status,
    data,
  });
});

// Restore Post:
export const restorePost = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { postID } = req.params;

  // Delete Post :
  const data = await Post.findOneAndUpdate(
    { _id: postID, isArchived: { $exists: true } },
    { $unset: { isArchived: 1 } },
    {
      projection: "_id",
      new: true,
      lean: true,
    }
  );

  return successResponse(res, {
    msg: generateMessage("Post").success.deleted.msg,
    status: generateMessage("Post").success.deleted.status,
    data,
  });
});

// Delete Post:
export const deletePost = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { postID } = req.params;

  // Delete Post :
  const data = await Post.findByIdAndDelete(postID);

  return successResponse(res, {
    msg: generateMessage("Post").success.deleted.msg,
    status: generateMessage("Post").success.deleted.status,
    data,
  });
});

// Un/Like Post:
export const postLike = asnycHandler(async (req, res, next) => {
  // Post's Id :
  const { postID } = req.params;

  // Post's Like List :
  const { likedBy } = req.post;

  // User's Id :
  const { _id } = req.user;

  // Check For Existed Like :
  const check = likedBy.some((id) => id.equals(_id));

  // Update Post's Likes :
  const data = await Post.findByIdAndUpdate(
    postID,
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
    msg: generateMessage("Post").success.updated.msg,
    status: generateMessage("Post").success.updated.status,
    data,
  });
});
