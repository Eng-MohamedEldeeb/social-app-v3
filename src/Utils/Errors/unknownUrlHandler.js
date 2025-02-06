import { errorResponse } from "../Res/error.response.js";

export const unknownUrlHandler = (req, res, next) => {
  return errorResponse(
    { next },
    { error: "Unknown URL! =>" + req.originalUrl, code: 404 }
  );
};
