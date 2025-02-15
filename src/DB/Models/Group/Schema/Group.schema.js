import { Types, Schema } from "mongoose";
import * as fieldOptions from "../../../Options/field.length.js";
import {
  groupInfoLength,
  groupNameLength,
} from "../Validation/Group.validation.js";
import { generateMessage } from "../../../../Utils/Messages/messages.generator.js";

const groupSchema = new Schema(
  {
    // Group Cover :
    cover: {
      secure_url: {
        type: String,
        default: "No Cover Url",
      },
      public_id: {
        type: String,
        default: "No Cover Id",
      },
    },

    // Group Name :
    groupName: {
      type: String,
      required: [true, generateMessage("Group Name").errors.required.error],

      minlength: [
        groupNameLength.min,
        fieldOptions.fieldLength({
          fieldName: "Group Description",
          max: groupNameLength.min,
        }).min.msg,
      ],

      maxlength: [
        groupNameLength.max,
        fieldOptions.fieldLength({
          fieldName: "Group Description",
          max: groupNameLength.max,
        }).max.msg,
      ],
    },

    // Group Description :
    groupInfo: {
      type: String,
      default: "Welcome To Our Group",

      maxlength: [
        groupInfoLength.max,
        fieldOptions.fieldLength({
          fieldName: "Group Description",
          max: groupInfoLength.max,
        }).max.msg,
      ],
    },

    // Group Creator :
    creator: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, generateMessage("Group Creator").errors.required.error],
    },

    // Admins :
    admins: {
      type: [{ type: Types.ObjectId, ref: "user" }],
      validate: [
        function (val) {
          return val.length !== 1;
        },
        "{PATH} Can't Have More Then 4 Admins Maximum!",
      ],
    },

    // Members :
    members: [{ type: Types.ObjectId, ref: "user" }],

    // Posts :
    posts: [{ type: Types.ObjectId, ref: "post" }],
  },
  {
    timestamps: true,
  }
);

export default groupSchema;
