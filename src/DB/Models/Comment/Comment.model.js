import { model } from "mongoose";
import commentSchema from "./Schema/Comment.schema.js";
import { post_findOneAndDelete } from "./Hooks/Comment.hooks.js";

commentSchema.post("findOneAndDelete", post_findOneAndDelete);

const Comment = model("comment", commentSchema);

export default Comment;
