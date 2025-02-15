import Comment from "../Comment.model.js";

export const post_findOneAndDelete = async function (doc, next) {
  const commentID = doc._id;
  await Comment.deleteMany({ onComment: commentID });
};
