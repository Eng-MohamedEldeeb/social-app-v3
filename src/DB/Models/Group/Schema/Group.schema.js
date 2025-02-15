import { Types, Schema } from "mongoose";
import {
  groupInfoLength,
  groupNameLength,
} from "../Validation/Group.validation.js";
import { generateMessage } from "../../../../Utils/Messages/messages.generator.js";
import { fieldLength } from "../../../Options/field.validation.js";

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
        fieldLength({
          fieldName: "Group Description",
          max: groupNameLength.min,
        }).min.msg,
      ],

      maxlength: [
        groupNameLength.max,
        fieldLength({
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
        fieldLength({
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

// Group Privacy :
isPrivate : Boolean,

// Group Requests :
requests: {[type: Types.ObjectId, ref: "user"]}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default groupSchema;
