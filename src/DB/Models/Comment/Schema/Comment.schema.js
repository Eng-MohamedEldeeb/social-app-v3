import { Schema, Types } from "mongoose";
import { contentLength } from "../Validation/Comment.validation.js";
import { fieldLength } from "../../../Options/field.validation.js";

const commentSchema = new Schema(
  {
    attachment: {
      secure_url: String,
      public_id: String,
    },

    content: {
      type: String,
      requried: function () {
        return this.picture.secure_url ? false : true;
      },

      maxlength: [
        fieldLength({
          fieldName: "Post Content",
          max: contentLength.max,
        }).max.value,
        fieldLength({
          fieldName: "Post Content",
          max: contentLength.max,
        }).max.msg,
      ],
    },

    likedBy: [{ type: Types.ObjectId, ref: "user" }],

    owner: { type: Types.ObjectId, ref: "user" },
    onPost: { type: Types.ObjectId, ref: "post" },
    onComment: { type: Types.ObjectId, ref: "comment" },
  },
  {
    timestamps: true,
  }
);

export default commentSchema;
