import { Types } from "mongoose";
import { generateMessage } from "../../Messages/messages.generator.js";

export const validateObjID = (value, helpers) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helpers.message(generateMessage("ObjectId").errors.invalidFormate.error);
};
