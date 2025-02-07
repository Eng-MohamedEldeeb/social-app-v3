import { Types } from "mongoose";
import { generateMessage } from "../../Messages/messages.generator.js";

export const validateObjID = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message(generateMessage("ObjectId").errors.invalidFormate.error);
};
