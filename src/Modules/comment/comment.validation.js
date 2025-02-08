import joi from "joi";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

// Get Single Comment Validation :
export const getSingleComment = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),

    // Params:
    commentID: generalFields.id.required(),
  })
  .required();

// Add Comment Validation :
export const addComment = joi
  .object()
  .keys({
    // Post:
    file: joi.object().keys({
      ...generalFields.file,
      mimetype: generalFields.fileType.mimetype.valid(...fileTypes.img),
    }),

    content: generalFields.content,
    owner: generalFields.id.required(),
    post: generalFields.id.required(),

    // Params:
    postID: generalFields.id.required(),

    // Token:
    ["authorization"]: generalFields.token.required(),
  })
  .or("content", "file");

// Edit Comment Validation :
export const editComment = joi
  .object()
  .keys({
    // Comment:
    content: generalFields.content,
    owner: generalFields.id.required(),

    // Token:
    ["authorization"]: generalFields.token.required(),

    // Params:
    postID: generalFields.id.required(),
    commentID: generalFields.id.required(),
  })
  .required();

// Delete Comment Validation :
export const deleteComment = joi
  .object()
  .keys({
    // Comment:
    owner: generalFields.id.required(),
    // Token:
    ["authorization"]: generalFields.token.required(),
    // Params:
    postID: generalFields.id.required(),
    commentID: generalFields.id.required(),
  })
  .required();

// Like Comment Validation :
export const commentLike = joi
  .object()
  .keys({
    // Token:
    ["authorization"]: generalFields.token.required(),

    // Params:
    postID: generalFields.id.required(),
    commentID: generalFields.id.required(),
  })
  .required();
