import { Router } from "express";
import * as postService from "./service/post.service.js";
import * as postSelection from "./post.select.js";
import * as postValidators from "./post.validation.js";
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";
import { validation } from "../../Utils/Validation/validation.js";
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";
import { postAuthentication } from "../../Middlewares/post/postAuthentication.js";
import { postAuthorization } from "../../Middlewares/post/postAuthorization.js";
import commentRouter from "./../comment/comment.controller.js";

const router = Router();

/**
 * @link /:postID/comment
 * @description Route To Comments Router
 **/
router.use(
  "/:postID/comments",
  isAuthorized,
  isAuthenticated({
    options: {
      projection: postSelection.commentRouter.isAuthenticated.projection,
    },
  }),
  postAuthentication({
    options: {
      projection: postSelection.commentRouter.postAuthentication.projection,
    },
    archivedField: false,
  }),
  commentRouter
);

/**
 * @method GET
 * @link /
 * @description GET All Posts
 **/
router.get(
  "/",
  isAuthorized,
  isAuthenticated({
    options: { projection: postSelection.addPost.projection },
  }),
  postService.getAllPosts
);

/**
 * @method GET
 * @link /post/:postID
 * @param /:postID
 * @description GET Single Post
 **/
router.get(
  "/:postID",
  validation({
    schema: postValidators.getSinglePost,
    token: "authorization",
  }),
  isAuthorized,
  isAuthenticated({
    options: {
      projection: postSelection.getSinglePost.isAuthenticated.projection,
    },
  }),
  postAuthentication({
    archivedField: false,
    options: {
      populate: postSelection.getSinglePost.postAuthentication.populate,
    },
  }),

  postService.getSinglePost
);

/**
 * @method POST
 * @link /post
 * @description Creating Post
 **/
router.post(
  "/:groupId?",
  fileReader({ fileType: fileTypes.img }).single("img"),
  isAuthorized,
  isAuthenticated({
    options: { projection: postSelection.addPost.projection },
  }),
  validation({
    schema: postValidators.addPost,
    token: "authorization",
  }),
  postService.addPost
);

/**
 * @method PATCH
 * @link /post/edit/:postID
 * @param /:postID
 * @description Edit Post
 **/
router.patch(
  "/edit/:postID",
  isAuthorized,
  isAuthenticated({
    options: { projection: postSelection.editPost.isAuthenticated.projection },
  }),
  postAuthentication({
    archivedField: false,
    options: {
      projection: postSelection.editPost.postAuthentication.projection,
    },
  }),
  postAuthorization,
  validation({
    schema: postValidators.editPost,
    token: "authorization",
  }),
  postService.editPost
);

/**
 * @method DELETE
 * @link /post/archive/:postID
 * @param /:postID
 * @description Archive Post
 **/
router.delete(
  "/archive/:postID",
  isAuthorized,
  isAuthenticated({
    options: {
      projection: postSelection.archivePost.isAuthenticated.projection,
    },
  }),
  postAuthentication({
    archivedField: false,
    options: {
      projection: postSelection.archivePost.postAuthentication.projection,
    },
  }),
  postAuthorization,
  validation({
    schema: postValidators.archivePost,
    token: "authorization",
  }),
  postService.archivePost
);

/**
 * @method PUT
 * @link /post/restore/:postID
 * @param /:postID
 * @description Restore Post
 **/
router.put(
  "/restore/:postID",
  isAuthorized,
  isAuthenticated({
    options: {
      projection: postSelection.restorePost.isAuthenticated.projection,
    },
  }),
  postAuthentication({
    archivedField: true,
    options: {
      projection: postSelection.restorePost.postAuthentication.projection,
    },
  }),
  postAuthorization,
  validation({
    schema: postValidators.restorePost,
    token: "authorization",
  }),
  postService.restorePost
);

/**
 * @method DELETE
 * @link /post/permanent-delete/:postID
 * @param /:postID
 * @description Delete Post
 **/
router.delete(
  "/permanent-delete/:postID",
  isAuthorized,
  isAuthenticated({
    options: {
      projection: postSelection.deletePost.isAuthenticated.projection,
    },
  }),
  postAuthentication({
    archivedField: false,
    options: {
      projection: postSelection.deletePost.postAuthentication.projection,
    },
  }),
  postAuthorization,
  validation({
    schema: postValidators.deletePost,
    token: "authorization",
  }),
  postService.deletePost
);

/**
 * @method POST
 * @link /post/like-Unlike/:postID
 * @param /:postID
 * @description Like Or Unlike Post
 **/
router.post(
  "/like-Unlike/:postID",
  isAuthorized,
  isAuthenticated({
    options: {
      projection: postSelection.postLike.isAuthenticated.projection,
    },
  }),
  postAuthentication({
    archivedField: false,
    options: {
      projection: postSelection.postLike.postAuthentication.projection,
    },
  }),
  validation({
    schema: postValidators.postLike,
    token: "authorization",
  }),
  postService.postLike
);

export default router;
