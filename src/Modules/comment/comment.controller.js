// Routers :
import { Router } from "express";
import replyRouter from "../reply/reply.controller.js";

// Services :
import {
  getPostComments,
  getSingleComment,
} from "./service/commentGet.service.js";
import { addComment } from "./service/addComment.service.js";
import { editComment } from "./service/editComment.service.js";
import { deleteComment } from "./service/deleteComment.service.js";
import { commentLike } from "./service/commentLike.service.js";

// Selection :
import * as commentSelection from "./comment.select.js";

// Validators :
import * as commentValidators from "./comment.validation.js";
import { validation } from "../../Utils/Validation/validation.js";
import { commentAuthentication } from "../../Middlewares/comment/commentAuthentication.js";
import { commentAuthorization } from "../../Middlewares/comment/commentAuthorization.js";

// Files :
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

const router = Router({ mergeParams: true });

router.use(
  "/:commentId/replies",
  commentAuthentication({
    options: commentSelection.replyRouter.commentAuthentication.projection,
  }),
  replyRouter
);

/**
 * @method GET
 * @link /
 * @description GET All Post's Comments
 **/
router.get("/all", getPostComments);

/**
 * @method GET
 * @link /comment/:commentId
 * @param /:commentId
 * @description GET Single Comment
 **/
router.get(
  "/:commentId",
  validation({
    schema: commentValidators.getSingleComment,
    token: "authorization",
  }),
  commentAuthentication({
    options: {
      projection:
        commentSelection.getSingleComment.commentAuthentication.projection,
      populate:
        commentSelection.getSingleComment.commentAuthentication.populate,
    },
  }),
  getSingleComment
);

/**
 * @method POST
 * @link /comment
 * @description Add Comment
 **/
router.post(
  "/add",
  fileReader({ fileType: fileTypes.img }).single("img"),
  validation({
    schema: commentValidators.addComment,
    token: "authorization",
  }),
  addComment
);

/**
 * @method PUT
 * @link /comment/edit/:commentId
 * @param /:commentId
 * @description Edit Comment
 **/
router.put(
  "/edit/:commentId",
  commentAuthentication({
    options: {
      projection: commentSelection.editComment.commentAuthentication.projection,
    },
  }),
  commentAuthorization,
  validation({
    schema: commentValidators.editComment,
    token: "authorization",
  }),
  editComment
);

/**
 * @method DELETE
 * @link /comment/permanent-delete/:commentId
 * @param /:commentId
 * @description Delete Comment
 **/
router.delete(
  "/permanent-delete/:commentId",
  commentAuthentication({
    options: {
      projection:
        commentSelection.deleteComment.commentAuthentication.projection,
    },
  }),
  commentAuthorization,
  validation({
    schema: commentValidators.deleteComment,
    token: "authorization",
  }),
  deleteComment
);

/**
 * @method POST
 * @link /comment/like-Unlike/:commentId
 * @param /:commentId
 * @description Like Or Unlike Comment
 **/
router.post(
  "/like-Unlike/:commentId",
  commentAuthentication({
    options: {
      projection: commentSelection.commentLike.commentAuthentication.projection,
    },
  }),
  validation({
    schema: commentValidators.commentLike,
    token: "authorization",
  }),
  commentLike
);

export default router;
