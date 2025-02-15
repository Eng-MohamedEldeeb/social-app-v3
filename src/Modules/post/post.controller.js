// Routers :
import { Router } from "express";
import commentRouter from "./../comment/comment.controller.js";

// Services :
import { getAllPosts, getSinglePost } from "./service/getPosts.service.js";
import { addPost } from "./service/addPost.service.js";
import { editPost } from "./service/editPost.service.js";
import { archivePost } from "./service/archivePost.service.js";
import { restorePost } from "./service/restorePost.service.js";
import { deletePost } from "./service/deletePost.service.js";
import { postLike } from "./service/postLike.service.js";

// Selections :
import * as postSelection from "./post.select.js";

// Validators :
import * as postValidators from "./post.validation.js";
import { validation } from "../../Utils/Validation/validation.js";

// Authorizations L
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";
import { postAuthentication } from "../../Middlewares/post/postAuthentication.js";
import { postAuthorization } from "../../Middlewares/post/postAuthorization.js";

// Files :
import { fileReader } from "../../Utils/Upload/fileReader.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

const router = Router();

/**
 * @link /:postID/comment
 * @description Route To Comments Router
 **/
router.use(
  "/:postId/comments",
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
  getAllPosts
);

/**
 * @method GET
 * @link /post/:postID
 * @param /:postID
 * @description GET Single Post
 **/
router.get(
  "/:postId",
  validation({
    schema: postValidators.getSinglePost,
    token: "authorization",
  }),
  isAuthorized,
  isAuthenticated({
    options: {},
  }),
  postAuthentication({
    archivedField: false,
    options: {},
  }),

  getSinglePost
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
  addPost
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
  editPost
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
  archivePost
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
  restorePost
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
  deletePost
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
  postLike
);

export default router;
