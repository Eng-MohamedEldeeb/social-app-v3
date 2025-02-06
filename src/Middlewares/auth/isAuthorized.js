import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { errorResponse } from "../../Utils/Res/error.response.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { verifyToken } from "../../Utils/Security/token.js";

export const isAuthorized = asnycHandler((req, res, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (!bearer) {
    const { error, status } = generateMessage("Token").errors.required;
    return errorResponse(
      { next },
      {
        error,
        status,
      }
    );
  }
  if (!token) {
    const { error, status } = generateMessage().errors.invalidToken;
    return errorResponse(
      { next },
      {
        error,
        status,
      }
    );
  }

  const tokenData = verifyToken({ token });

  req.token = tokenData;
  return next();
});
