import { Router } from "express";
import * as replyService from "./service/reply.service.js";
import * as replySelection from "./reply.select.js";
import * as replyValidators from "./reply.validation.js";
import { validation } from "../../Utils/Validation/validation.js";
import { replyAuthentication } from "../../Middlewares/reply/replyAuthentication.js";
import { replyAuthorization } from "../../Middlewares/reply/replyAuthorization.js";

const router = Router({ mergeParams: true });

/**
 * @method GET
 * @link /
 * @description GET All Comment's Replies
 **/
router.get("/all", replyService.getCommentReplies);

/**
 * @method GET
 * @link /comment/:replyID
 * @param /:replyID
 * @description GET Single Reply
 **/
router.get(
  "/:replyID",
  validation({
    schema: replyValidators.getSingleReply,
    token: "authorization",
  }),
  replyAuthentication({
    options: {
      projection: replySelection.getSingleReply.replyAuthentication.projection,
      populate: replySelection.getSingleReply.replyAuthentication.populate,
    },
  }),
  replyService.getSingleReply
);

/**
 * @method POST
 * @link /reply
 * @description Add Reply
 **/
router.post(
  "/add",
  validation({
    schema: replyValidators.addReply,
    token: "authorization",
  }),
  replyService.addReply
);

/**
 * @method PUT
 * @link /reply/edit/:replyID
 * @param /:replyID
 * @description Edit Reply
 **/
router.put(
  "/edit/:replyID",
  replyAuthentication({
    options: {
      projection: replySelection.editReply.replyAuthentication.projection,
    },
  }),
  replyAuthorization,
  validation({
    schema: replyValidators.editReply,
    token: "authorization",
  }),
  replyService.editReply
);

/**
 * @method DELETE
 * @link /reply/permanent-delete/:replyID
 * @param /:replyID
 * @description Delete Reply
 **/
router.delete(
  "/permanent-delete/:replyID",
  replyAuthentication({
    options: {
      projection: replySelection.deleteReply.replyAuthentication.projection,
    },
  }),
  replyAuthorization,
  validation({
    schema: replyValidators.deleteReply,
    token: "authorization",
  }),
  replyService.deleteReply
);

/**
 * @method POST
 * @link /comment/like-Unlike/:replyID
 * @param /:replyID
 * @description Like Or Unlike Reply
 **/
router.post(
  "/like-Unlike/:replyID",
  replyAuthentication({
    options: {
      projection: replySelection.replyLike.replyAuthentication.projection,
    },
  }),
  validation({
    schema: replyValidators.replyLike,
    token: "authorization",
  }),
  replyService.replyLike
);

export default router;
