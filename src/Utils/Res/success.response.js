export const successResponse = (
  { res } = {},
  { msg = "", status = 200, data = null } = {}
) => {
  return res.status(status).json({ success: true, msg, ...(data && { data }) });
};
