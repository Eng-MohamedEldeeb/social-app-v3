import { model } from "mongoose";

// Group Schema :
import groupSchema from "./Schema/Group.schema.js";

// Hooks Funcs :
import { post_findOneAndDelete } from "./Hooks/Group.hooks.js";

groupSchema.virtual("posts", {
  ref: "post",
  localField: "_id",
  foreignField: "onGroup",
});

// Hooks :
/* Pre Delete*/
groupSchema.post("findOneAndDelete", post_findOneAndDelete);

// Model Definetion :
const Group = model("group", groupSchema);

export default Group;
