import User from "../../../DB/Models/User/User.model.js";
import { compareValue } from "../../../Utils/Security/hash.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

// Reset Password:
export const resetPassword = asnycHandler(async (req, res, next) => {
  // E-mai & New Password Info :
  const { email, newPassword } = req.body;

  // Used Passwords List :
  const { password: oldPassword, passwords } = await User.findOne({ email })
    .lean()
    .select({ password: 1, passwords: 1 });

  // Check If The New Password Was As The Old One :
  const checkConflictedPasswords = compareValue({
    plainText: newPassword,
    cryptedValue: oldPassword,
  });

  // Check If The New Password Was Already Used By The User :
  const checkExistedPassword = passwords.some((pass) =>
    compareValue({ plainText: newPassword, cryptedValue: pass })
  );

  // Check For Both Passwords Conditions :
  if (checkConflictedPasswords || checkExistedPassword)
    return errorResponse(
      { next },
      { error: generateMessage().errors.conflictedPasswords.error, status: 409 }
    );

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
      msg: generateMessage("Password").success.updated.msg,
      status: 200,
      data,
    }
  );
});
