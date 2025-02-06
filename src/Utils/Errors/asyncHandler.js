import { errorResponse } from "../Res/error.response.js";

export const asnycHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if (error.errors)
        return errorResponse(
          { res },
          {
            error: {
              msg: error._message,
              errors: error.errors,
            },
            code: error.cause || 400,
          }
        );

      return next(error);
    }
  };
};
