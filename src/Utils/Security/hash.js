import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

export function hashValue({ payload, rounds = Number(process.env.ROUNDS) }) {
  try {
    const hashedValue = bcrypt.hashSync(payload, rounds);
    return hashedValue;
  } catch (error) {
    return console.error(error.message);
  }
}
export function compareValue({ plainText, cryptedValue }) {
  try {
    const comparedValue = bcrypt.compareSync(plainText, cryptedValue);
    return comparedValue;
  } catch (error) {
    return console.error(error.message);
  }
}

export function encryptValue({ payload, secretKey = process.env.CRYPTO_KEY }) {
  try {
    const cryptedValue = CryptoJS.AES.encrypt(payload, secretKey);
    return cryptedValue;
  } catch (error) {
    return console.error(error.message);
  }
}
export function decryptValue({ payload, secretKey = process.env.CRYPTO_KEY }) {
  try {
    const cryptedValue = CryptoJS.AES.decrypt(payload, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    return cryptedValue;
  } catch (error) {
    return console.error(error.message);
  }
}
