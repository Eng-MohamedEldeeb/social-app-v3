import Group from "../../../../DB/Models/Group/Group.model.js";
import { asnycHandler } from "../../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../../Utils/Messages/messages.generator.js";
import { successResponse } from "../../../../Utils/Res/success.response.js";
import { errorResponse } from "../../../../Utils/Res/error.response.js";

export const removeAdmin = asnycHandler(async (req, res, next) => {
  // Group Info :
  const { id } = req.params;

  // Requested Admin Id :
  const { user } = req.body;

  // Group Admins List Update :
  const data = await Group.findByIdAndUpdate(
    id,
    {
      $pull: { admins: user },
    },
    { lean: true, new: true, projection: "admins" }
  );

  //! If The Group Wasn't Found And Wasn't Updated :
  if (!data)
    return errorResponse(
      { next },
      {
        error: generateMessage("Group").errors.notFound.error,
        status: 404,
      }
    );

  return successResponse(
    { res },
    {
      msg: generateMessage("Group").success.updated.msg,
      status: 201,
      data,
    }
  );
});
