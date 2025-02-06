import fs from "node:fs";
import { errorResponse } from "../Res/error.response.js";

export const globalErrorHandler = (error, req, res, next) => {
  if (req.file && req.file?.path) fs.unlinkSync(req.file?.path);

  return errorResponse(
    { res },
    {
      error: { error: error.message, stack: error.stack },
      code: error.cause,
    }
  );
};
