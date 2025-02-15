import { Schema, Types } from "mongoose";
import { generateMessage } from "../../../../Utils/Messages/messages.generator.js";
import { fieldLength } from "../../../Options/field.validation.js";
import { contentLength, titleLength } from "../Validation/Post.validation.js";

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
        fieldLength({
          fieldName: "Post Title",
          max: titleLength.max,
        }).max.value,
        fieldLength({
          fieldName: "Post Title",
          max: titleLength.max,
        }).max.msg,
      ],
    },

    content: {
      type: String,
      requried: function () {
        return this.attachment.secure_url || this.title ? false : true;
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

export default postSchema;
