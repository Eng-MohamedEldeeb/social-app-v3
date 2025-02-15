import User from "../../../DB/Models/User/User.model.js";
import { compareValue } from "../../../Utils/Security/hash.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Reset Password:
export const resetPassword = asnycHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const { passwords } = req.user;
  const successMsg = generateMessage("Password").success.updated;

  const checkExistedPassword = passwords.some((pass) =>
    compareValue({ plainText: newPassword, cryptedValue: pass })
  );

  if (
    compareValue({
      plainText: newPassword,
      cryptedValue: req.user.password,
    }) ||
    checkExistedPassword
  ) {
    const { error, status } = generateMessage().errors.conflictedPasswords;

    return errorResponse({ next }, { error, status });
  }

  const data = await User.findOneAndUpdate(
    { email },
    {
      password: newPassword,
      passwordChangedAt: Date.now(),
    },
    { new: true, projection: { password: 1, passwords: 1 } }
  );

  return successResponse(
    { res },
    {
      msg: successMsg.msg,
      status: successMsg.status,
      data,
    }
  );
});
