import User from "../../../DB/Models/User/User.model.js";
import * as token from "../../../Utils/Security/token.js";
import { compareValue } from "../../../Utils/Security/hash.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Login:
export const login = asnycHandler(async (req, res, next) => {
  const { userName, password } = req.body;

  const successMsg = generateMessage("User").success.loggedIn;
  const errorMsg = generateMessage().errors.invalidCredentials;

  const user = await User.findOne(
    // { $or: [{ email }, { userName }, { phone }] },
    { userName },
    {},
    { projection: { password: 1 } }
  );

  if (
    !compareValue({
      plainText: password,
      cryptedValue: user.password,
    })
  )
    return errorResponse(
      { next },
      {
        error: errorMsg.error,
        status: errorMsg.status,
      }
    );

  const accessToken = token.generateToken({
    payload: { _id: user._id, userName },
    expiresIn: "5d",
  });
  const refreshToken = token.generateToken({
    payload: { _id: user._id, userName },
    expiresIn: "14d",
  });
  return successResponse(
    { res },
    {
      msg: successMsg.msg,
      status: successMsg.status,
      data: { accessToken, refreshToken },
    }
  );
});
