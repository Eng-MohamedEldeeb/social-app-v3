import { asnycHandler } from "../Errors/asyncHandler.js";
import { errorResponse } from "../Res/error.response.js";

export const validation = ({
  schema = null,
  token = false,
  query = false,
  otp = false,
}) => {
  return asnycHandler((req, res, next) => {
    const values = {
      ...req.body,
      ...req.params,
      ...(req.file && { file: req.file }),
      ...(token && { [token]: req.headers[token] }),
      ...(query && { [query]: req.headers[query] }),
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
          msg: error.message,
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
