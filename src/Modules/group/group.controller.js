// Express Router:
import { Router } from "express";

// Validations:
import { validation } from "../../Utils/Validation/validation.js";
import * as groupValidators from "./group.validation.js";

// Authentication Checkers :
import { isAuthorized } from "../../Middlewares/auth/isAuthorized.js";
import { isAuthenticated } from "../../Middlewares/auth/isAuthenticated.js";

// Services
import { getGroup } from "./services/getGroup.service.js";
import { createGroup } from "./services/Admin/createGroup.service.js";
import { groupAuthorization } from "../../Middlewares/group/groupAuthorization.js";
import { addAdmin } from "./services/Admin/addAdmin.service.js";
import { removeAdmin } from "./services/Admin/removeAdmin.service.js";
import { groupAuthentication } from "../../Middlewares/group/groupAuthentication.js";
import { removeMember } from "./services/Admin/removeMember.service.js";

const router = Router();

/**
 * @method GET
 * @link /group/:id
 * @param id => Optional.
 * @description If /:id Exists Gets a Specifc Group, Else Gets All Groups.
 **/
router.get(
  "/:id?",
  validation({ schema: groupValidators.getGroup }),
  isAuthorized,
  isAuthenticated(),
  getGroup
);

/**
 * @method POST
 * @link /group
 * @description Create a new Group.
 **/
router.post(
  "/",
  validation({ schema: groupValidators.createGroup }),
  isAuthorized,
  isAuthenticated(),
  createGroup
);

/**
 * @method POST
 * @link /group/:id/add-admin
 * @param id => Group Id.
 * @description Add Admin To The Requested Group
 **/
router.post(
  "/:id/add-admin",
  validation({ schema: groupValidators.addAdmin }),
  isAuthorized,
  isAuthenticated(),
  groupAuthentication(),
  groupAuthorization,
  addAdmin
);

/**
 * @method DELETE
 * @link /group/:id/remove-admin
 * @param id => Group Id.
 * @description Remove Admin From The Requested Group By Sending Admin's Id In Body Data.
 **/
router.delete(
  "/:id/remove-admin",
  validation({ schema: groupValidators.removeAdmin }),
  isAuthorized,
  isAuthenticated(),
  groupAuthentication(),
  groupAuthorization,
  removeAdmin
);

/**
 * @method DELETE
 * @link /group/:id/remove-member
 * @param id => Group Id.
 * @description Remove Member From The Requested Group By Sending Member's Id In Body Data.
 **/
router.delete(
  "/:id/remove-member",
  validation({ schema: groupValidators.removeMember }),
  isAuthorized,
  isAuthenticated(),
  groupAuthentication(),
  groupAuthorization,
  removeMember
);
export default router;
