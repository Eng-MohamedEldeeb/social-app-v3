import User from "../../DB/Models/User/User.model.js";
import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../Utils/Res/error.response.js";

export const isExisted = ({
  select = "",
  options = { projection, populate },
} = {}) => {
  return asnycHandler(async (req, res, next) => {
    const { email, userName } = req.body;
    const errorMsg = generateMessage("User").errors.alreadyExist;
    const isExist = await User.findOne(
      { $or: [{ email }, { userName }] },
      select,
      options
    );

    if (isExist)
      return errorResponse(
        { next },
        { error: errorMsg.error, status: errorMsg.status }
      );

    return next();
  });
};
