import Group from "../../DB/Models/Group/Group.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const groupAuthentication = ({
  select = {},
  populate,
  sort = {},
  lean = true,
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    // Group Id:
    const { id } = req.params;

    //? If Group Id Wasn't Existing:
    if (!id) return next();

    // If Group Id Existed:
    const group = await Group.findById(id, select, { populate, sort, lean });

    //! If The Group Didn't Exist:
    if (!group)
      return errorResponse(
        { next },
        {
          error: generateMessage("Group").errors.notFound.error,
          status: 404,
        }
      );

    //* If The Group Existed
    req.group = group;
    return next();
  });
};
