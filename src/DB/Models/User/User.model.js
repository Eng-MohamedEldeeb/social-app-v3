import mongoose, { model } from "mongoose";

// User Schema :
import userSchema from "./Schema/User.schema.js";

// Hooks Funcs :
import {
  post_findOneAndDelete,
  pre_findOneAndUpdate,
  pre_save,
} from "./Hooks/User.hooks.js";

// Hooks :

/* Pre Save */
userSchema.pre("save", pre_save);

/* Pre Update */
userSchema.pre("findOneAndUpdate", pre_findOneAndUpdate);

/* Post Delete */
userSchema.post("findOneAndDelete", post_findOneAndDelete);

// Model Definetion :
const User = model("user", userSchema);

export default User;
