import { Router } from "express";
import * as commentService from "./service/comment.service.js";
import * as commentSelection from "./comment.select.js";
import * as commentValidators from "./comment.validation.js";
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";
import { validation } from "../../Utils/Validation/validation.js";
import { commentAuthentication } from "../../Middlewares/comment/commentAuthentication.js";
import { commentAuthorization } from "../../Middlewares/comment/commentAuthorization.js";

const router = Router();

/**
 * @method GET
 * @link /
 * @description GET All Comments
 **/
router.get("/", commentService.getAllComments);

/**
 * @method GET
 * @link /comment/:commentID
 * @param /:commentID
 * @description GET Single Comment
 **/
router.get(
  "/:commentID",
  commentAuthentication({
    options: {
      projection:
        commentSelection.getSingleComment.commentAuthentication.projection,
    },
  }),

  validation({
    schema: commentValidators.getSingleComment,
    token: "authorization",
  }),
  commentService.getSingleComment
);

/**
 * @method POST
 * @link /comment
 * @description Add Comment
 **/
router.post(
  "/",
  fileReader({ fileType: fileTypes.img }).single("img"),
  validation({
    schema: commentValidators.addComment,
    token: "authorization",
    _id: "owner",
  }),
  commentService.addComment
);

/**
 * @method PATCH
 * @link /comment/edit/:commentID
 * @param /:commentID
 * @description Edit Comment
 **/
router.patch(
  "/edit/:commentID",
  commentAuthentication({
    options: {
      projection: commentSelection.editComment.commentAuthentication.projection,
    },
  }),
  commentAuthorization,
  validation({
    schema: commentValidators.editComment,
    token: "authorization",
    _id: "owner",
  }),
  commentService.editComment
);

/**
 * @method DELETE
 * @link /comment/permanent-delete/:commentID
 * @param /:commentID
 * @description Delete Comment
 **/
router.delete(
  "/permanent-delete/:commentID",
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
    _id: "owner",
  }),
  commentService.deleteComment
);

/**
 * @method POST
 * @link /comment/like-Unlike/:commentID
 * @param /:commentID
 * @description Like Or Unlike Comment
 **/
router.post(
  "/like-Unlike/:commentID",
  commentAuthentication({
    options: {
      projection: commentSelection.commentLike.commentAuthentication.projection,
    },
  }),
  validation({
    schema: commentValidators.commentLike,
    token: "authorization",
  }),
  commentService.commentLike
);

export default router;
