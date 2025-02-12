import jwt from "jsonwebtoken";

export function generateToken({
  payload,
  expiresIn,
  secretKey = process.env.JWT_KEY,
}) {
  try {
    const generatedToken = jwt.sign(payload, secretKey, { expiresIn });
    return generatedToken;
  } catch (error) {
    console.error("Token Error: " + error.message);
    return error;
  }
}
export function verifyToken({ token, secretKey = process.env.JWT_KEY }) {
  try {
    const verifiedToken = jwt.verify(token, secretKey);
    return verifiedToken;
  } catch (error) {
    return error;
  }
}
