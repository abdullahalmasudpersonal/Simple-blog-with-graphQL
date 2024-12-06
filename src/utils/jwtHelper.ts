import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

const generateToken = async (payLoad: { userId: string }, secret: Secret) => {
  const token = jwt.sign(payLoad, secret as string, {
    expiresIn: "1d",
  });
  return token;
};

const getUserInfoFromToken = async (token: string) => {
  try {
    const userData = jwt.verify(token, config.jwt.secret as string) as {
      userId: string;
    };
    return userData;
  } catch (err) {
    return null;
  }
};

export const jwtHelper = {
  generateToken,
  getUserInfoFromToken,
};
