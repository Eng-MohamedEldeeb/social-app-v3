import Comment from "../../Comment/Comment.model.js";

export const post_findOneAndDelete = async function (doc, next) {
  const postId = doc._id;
  await Comment.deleteMany({ onPost: postId });
};
