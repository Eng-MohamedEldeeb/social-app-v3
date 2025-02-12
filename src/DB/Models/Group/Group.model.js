import mongoose, { model } from "mongoose";

// Group Schema :
import groupSchema from "./Schema/Group.schema.js";

// Hooks Funcs :
import { post_findOneAndDelete } from "./Hooks/Group.hooks.js";

// Hooks :

/* Pre Delete*/
groupSchema.post("findOneAndDelete", post_findOneAndDelete);

// Model Definetion :
const Group = mongoose.models.Group || model("group", groupSchema);

export default Group;
