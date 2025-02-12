import Post from "../../Post.model.js";

export const post_findOneAndDelete = async function (doc, next) {
  const { _id } = doc;
  await Post.deleteMany({ onGroup: _id });
};
