import mongoose, { Schema, Types, model } from "mongoose";
import * as fieldOptions from "../Options/field.length.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";

const postSchema = new Schema(
  {
    picture: {
      secure_url: String,
      public_id: String,
      required: function () {
        return this.title || this.content ? false : true;
      },
    },

    title: {
      type: String,
      required: function () {
        return this.picture.secure_url || this.content ? false : true;
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
        return this.picture.secure_url || this.title ? false : true;
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
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || model("post", postSchema);

export default Post;
