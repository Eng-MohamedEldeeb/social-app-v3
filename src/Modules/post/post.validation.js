import joi from "joi";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Get Single Post Validation :
export const getSinglePost = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),

    // Params:
    postId: generalFields.id.required(),
  })
  .required();

// Add Post Validation :
export const addPost = joi
  .object()
  .keys({
    // Post:
    file: joi.object().keys({
      ...generalFields.file,
      mimetype: generalFields.fileType.mimetype.valid(...fileTypes.img),
    }),
    title: generalFields.title,
    content: generalFields.content,
    allowComments: joi.boolean().valid(true, false).default(true),

    // Group Id :
    groupId: generalFields.id,

    // Token:
    ["authorization"]: generalFields.token.required(),
  })
  .or("title", "content");

// Edit Post Validation :
export const editPost = joi
  .object()
  .keys({
    // Post:
    title: generalFields.title,
    content: generalFields.content,

    // Token:
    ["authorization"]: generalFields.token.required(),

    // Params:
    postId: generalFields.id.required(),
  })
  .required();

// Archive Post Validation :
export const archivePost = joi
  .object()
  .keys({
    // Token:
    ["authorization"]: generalFields.token.required(),
    // Params:
    postId: generalFields.id.required(),
  })
  .required();

// Restore Post Validation :
export const restorePost = joi
  .object()
  .keys({
    // Token:
    ["authorization"]: generalFields.token.required(),
    // Params:
    postId: generalFields.id.required(),
  })
  .required();

// Delete Post Validation :
export const deletePost = joi
  .object()
  .keys({
    // Token:
    ["authorization"]: generalFields.token.required(),
    // Params:
    postId: generalFields.id.required(),
  })
  .required();

// Like Post Validation :
export const postLike = joi
  .object()
  .keys({
    // Token:
    ["authorization"]: generalFields.token.required(),
    // Params:
    postId: generalFields.id.required(),
  })
  .required();
