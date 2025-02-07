import mongoose, { Schema, Types, model } from "mongoose";
import * as fieldOptions from "../Options/field.length.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";

const postSchema = new Schema(
  {
    postPicture: {
      secure_url: String,
      public_id: String,
    },

    title: {
      type: String,
      required: function () {
        return this.postPicture.secure_url || this.content ? false : true;
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
        return this.postPicture.secure_url || this.title ? false : true;
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

    isArchived: Boolean,
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || model("post", postSchema);

export default Post;
