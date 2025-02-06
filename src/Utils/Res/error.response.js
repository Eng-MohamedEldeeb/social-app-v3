export const errorResponse = (
  { res, next } = {},
  { error = "", status = 500 } = {}
) => {
  return res
    ? res.status(status).json({ success: false, error })
    : next(new Error(error, { cause: status }));
};
