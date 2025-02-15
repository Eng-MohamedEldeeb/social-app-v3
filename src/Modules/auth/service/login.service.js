// DB Model :
import User from "../../../DB/Models/User/User.model.js";

// Utils :
import { generateToken } from "../../../Utils/Security/token.js";
import { compareValue } from "../../../Utils/Security/hash.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

export const login = asnycHandler(async (req, res, next) => {
  // User Login Info :
  const { userName, password } = req.body;

  // Searching For The User :
  const user = await User.findOne({ userName })
    .select({ password: 1, isDeactivated: 1 })
    .lean();

  //! If There Was No User :
  if (!user)
    return errorResponse(
      { next },
      { error: generateMessage("User").errors.notFound.error, status: 404 }
    );

  //! Incorrect Password :
  if (
    !compareValue({
      plainText: password,
      cryptedValue: user.password,
    })
  )
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.invalidCredentials.error,
        status: 400,
      }
    );

  // If The User Account Was Deactivated :
  if (user.isDeactivated)
    await User.findByIdAndUpdate(user._id, {
      $unset: { isDeactivated: 1 },
    })
      .lean()
      .select({ _id: 1 });

  // Tokens :
  const accessToken = generateToken({
    payload: { _id: user._id, userName },
    expiresIn: "5d",
  });
  const refreshToken = generateToken({
    payload: { _id: user._id, userName },
    expiresIn: "14d",
  });

  return successResponse(
    { res },
    {
      msg: generateMessage("User").success.loggedIn.msg,
      status: 200,
      data: { accessToken, refreshToken },
    }
  );
});
