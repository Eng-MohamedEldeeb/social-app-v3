import mongoose, { Schema, Types, model } from "mongoose";
import * as fieldOptions from "../Options/field.length.js";

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

    owner: { type: Types.ObjectId, ref: "user" },
    post: { type: Types.ObjectId, ref: "post" },
    replyingTo: { type: Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

commentSchema.post("findOneAndDelete", async function (doc, next) {
  const commentID = doc._id;
  await mongoose.models.Comment.deleteMany({ replyingTo: commentID });
});

const Comment = mongoose.models.Comment || model("comment", commentSchema);

export default Comment;
