import { model } from "mongoose";
import postSchema from "./Schema/Post.schema.js";
import { post_findOneAndDelete } from "./Hooks/Post.hooks.js";

postSchema.post("findOneAndDelete", post_findOneAndDelete);

const Post = model("post", postSchema);

export default Post;
