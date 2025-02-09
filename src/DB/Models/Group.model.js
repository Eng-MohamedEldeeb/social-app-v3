import mongoose, { Schema, Types, model } from "mongoose";
import * as fieldOptions from "../Options/field.length.js";

const groupSchema = new Schema(
  {
    cover: {
      secure_url: String,
      public_id: String,
    },

    groupName: {
      type: String,
      required: [true, generateMessage("Group Name").errors.required.error]

      minlength: [
        fieldOptions.fieldLength({
          fieldName: "Group Name",
          min: fieldOptions.contentLength.min,
        }).min.value,
        fieldOptions.fieldLength({
          fieldName: "Group Description",
          max: fieldOptions.contentLength.min,
        }).min.msg,
      ],
      maxlength: [
        fieldOptions.fieldLength({
          fieldName: "Group Name",
          max: fieldOptions.contentLength.max,
        }).max.value,
        fieldOptions.fieldLength({
          fieldName: "Group Description",
          max: fieldOptions.contentLength.max,
        }).max.msg,
      ],
      },

    info: {
      type: String,
      default: "Welcome To Our Group",

      maxlength: [
        fieldOptions.fieldLength({
          fieldName: "Group Description",
          max: fieldOptions.contentLength.max,
        }).max.value,
        fieldOptions.fieldLength({
          fieldName: "Group Description",
          max: fieldOptions.contentLength.max,
        }).max.msg,
      ],
    },

    private: Boolean,

    members: [{ type: Types.ObjectId, ref: "user" }],

    admins: [{ type: Types.ObjectId, ref: "user" }],

    creator: { type: Types.ObjectId, ref: "user" },

    posts: [{ type: Types.ObjectId, ref: "post" }],
  },
  {
    timestamps: true,
    versionKey: false,
    skipVersioning: true,
  }
);

const Group = mongoose.models.Comment || model("group", groupSchema);

export default Group;
