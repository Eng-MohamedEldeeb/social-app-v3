import { asnycHandler } from "../Errors/asyncHandler.js";
import { errorResponse } from "../Res/error.response.js";

export const validation = ({
  schema = null,
  token = true,
  query = false,
  otp = false,
}) => {
  return asnycHandler((req, res, next) => {
    const values = {
      // Token Value:
      ...(token && { ["authorization"]: req.headers["authorization"] }),

      // Body Values:
      ...req.body,

      // Params:
      ...req.params,

      // Query Params:
      ...(query && { [query]: req.headers[query] }),

      // File | Files Values:
      ...(req.file && { file: req.file }),

      // OTP Value:
      ...(otp && {
        [otp]: req.headers[otp],
      }),
    };

    const { value, error } = schema.validate(values, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((error) => {
        return {
          msg: "validation Error",
          reason: error.message,
          path: error.path[0],
          type: error.type,
        };
      });

      return errorResponse(
        { res },
        { ...(errors.length == 1 ? { error: errors[0] } : { error: errors }) }
      );
    }

    return next();
  });
};
