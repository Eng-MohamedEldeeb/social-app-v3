import mongoose, { Schema, Types, model } from "mongoose";
import * as fieldOptions from "../Options/field.length.js";

const commentSchema = new Schema(
  {
    commentPicture: {
      secure_url: String,
      public_id: String,
    },

    content: {
      type: String,
      requried: function () {
        return this.picture.secure_url ? false : true;
      },

      maxlength: [
        fieldOptions.fieldLength({
          fieldName: "Post Content",
          max: fieldOptions.contentLength.max,
        }).max.value,
        fieldOptions.fieldLength({
          fieldName: "Post Content",
          max: fieldOptions.contentLength.max,
        }).max.msg,
      ],
    },

    likedBy: [{ type: Types.ObjectId, ref: "user" }],
    replies: [{ type: Types.ObjectId, ref: "comment" }],

    post: { type: Types.ObjectId, ref: "post" },
    owner: { type: Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.models.Comment || model("comment", commentSchema);

export default Comment;
