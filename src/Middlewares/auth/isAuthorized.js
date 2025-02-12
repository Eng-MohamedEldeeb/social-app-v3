import { asnycHandler } from "../../Utils/Errors/asyncHandler.js";
import { errorResponse } from "../../Utils/Res/error.response.js";
import { generateMessage } from "../../Utils/Messages/messages.generator.js";
import { verifyToken } from "../../Utils/Security/token.js";

const bearerTokens = {
  bearer: "Bearer",
};

export const isAuthorized = asnycHandler((req, res, next) => {
  //? Authorization :
  const { authorization } = req.headers;

  //! Bearer Missing :
  if (!authorization)
    return errorResponse(
      { next },
      {
        error: generateMessage("Token").errors.required.error,
        status: 400,
      }
    );

  // Bearer , token :
  const [bearer, token] = authorization.split(" ");

  //! Bearer Missing :
  if (!bearer || bearer != bearerTokens.bearer)
    return errorResponse(
      { next },
      {
        error: generateMessage("Bearer Token").errors.required.error,
        status: 400,
      }
    );

  //! Token Missing :
  if (!token)
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.invalidToken.error,
        status: 400,
      }
    );

  // Verifing Token Data :
  const tokenData = verifyToken({ token });

  //! If The Token Was Expired :
  if (tokenData.name == "TokenExpiredError")
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.expiredToken.error,
        status: 400,
      }
    );

  //! If The Token Was in-valid :
  if (tokenData.name == "JsonWebTokenError")
    return errorResponse(
      { next },
      {
        error: generateMessage().errors.invalidToken.error,
        status: 400,
      }
    );

  req.token = tokenData;

  return next();
});
