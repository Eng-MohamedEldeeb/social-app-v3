import joi from "joi";
import {
  groupInfoLength,
  groupNameLength,
} from "../../DB/Models/Group/Validation/Group.validation.js";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";

// Get Group:
export const getGroup = joi
  .object()
  .keys({
    // Group Id Validation :
    id: generalFields.id,

    // Token Validation :
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Create Group:
export const createGroup = joi
  .object()
  .keys({
    // Group Validation :
    groupName: joi
      .string()
      .min(groupNameLength.min)
      .max(groupNameLength.max)
      .required(),
    groupInfo: joi.string().max(groupInfoLength.max),

    // Token Validation :
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Add Admin To Admins Group List:
export const addAdmin = joi
  .object()
  .keys({
    // Group Validation :
    id: generalFields.id.required(),

    // Admin's Id Validation :
    admin: generalFields.id.required(),

    // Token Validation :
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Remove Admin From Admins Group List:
export const removeAdmin = joi
  .object()
  .keys({
    // Group Validation :
    id: generalFields.id.required(),

    // Admin's Id Validation :
    user: generalFields.id.required(),

    // Token Validation :
    ["authorization"]: generalFields.token.required(),
  })
  .required();

// Remove Member From Members Group List:
export const removeMember = joi
  .object()
  .keys({
    // Group Validation :
    id: generalFields.id.required(),

    // Admin's Id Validation :
    user: generalFields.id.required(),

    // Token Validation :
    ["authorization"]: generalFields.token.required(),
  })
  .required();
