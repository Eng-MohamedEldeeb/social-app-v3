import joi from "joi";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";

// Get Single Reply Validation :
export const getSingleReply = joi
  .object()
  .keys({
    ["authorization"]: generalFields.token.required(),

    // Params:
    postId: generalFields.id.required(),
    commentId: generalFields.id.required(),
    replyID: generalFields.id.required(),
  })
  .required();

// Add Reply Validation :
export const addReply = joi
  .object()
  .keys({
    content: generalFields.content.required(),

    // Params:
    postId: generalFields.id.required(),
    commentId: generalFields.id.required(),
    // Token:
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Edit Reply Validation :
export const editReply = joi
  .object()
  .keys({
    // Reply:
    content: generalFields.content.required(),

    // Token:
    ["authorization"]: generalFields.token.required(),

    // Params:
    postId: generalFields.id.required(),
    commentId: generalFields.id.required(),
    replyID: generalFields.id.required(),
  })
  .required();

// Delete Comment Validation :
export const deleteReply = joi
  .object()
  .keys({
    // Token:
    ["authorization"]: generalFields.token.required(),
    // Params:
    postId: generalFields.id.required(),
    commentId: generalFields.id.required(),
    replyID: generalFields.id.required(),
  })
  .required();

// Like Reply Validation :
export const replyLike = joi
  .object()
  .keys({
    // Token:
    ["authorization"]: generalFields.token.required(),

    // Params:
    postId: generalFields.id.required(),
    commentId: generalFields.id.required(),
    replyID: generalFields.id.required(),
  })
  .required();
