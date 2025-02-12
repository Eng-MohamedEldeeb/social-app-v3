import mongoose, { Schema, Types, model } from "mongoose";
import * as fieldOptions from "../Options/field.length.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import Comment from "./Comment.model.js";

const postSchema = new Schema(
  {
    attachment: {
      secure_url: String,
      public_id: String,
    },

    title: {
      type: String,
      required: function () {
        return this.attachment.secure_url || this.content ? false : true;
      },

      maxlength: [
        fieldOptions.fieldLength({
          fieldName: "Post Title",
          max: fieldOptions.titleLength.max,
        }).max.value,
        fieldOptions.fieldLength({
          fieldName: "Post Title",
          max: fieldOptions.titleLength.max,
        }).max.msg,
      ],
    },

    content: {
      type: String,
      requried: function () {
        return this.attachment.secure_url || this.title ? false : true;
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

    owner: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, generateMessage("Post's Owner").errors.required.error],
    },

    onGroup: { type: Types.ObjectId, ref: "group" },

    allowComments: Boolean,
    isArchived: Boolean,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

postSchema.post("findOneAndDelete", async function (doc, next) {
  const postID = doc._id;
  await Comment.deleteMany({ post: postID });
});

const Post = mongoose.models.Post || model("post", postSchema);

export default Post;
