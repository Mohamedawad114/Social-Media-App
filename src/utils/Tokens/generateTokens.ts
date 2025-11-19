import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { redis } from "../services/redis";
import { Sys_Role, Tokens } from "../../common";



export const generateTokens = async ({ res, role = Sys_Role.user, id,username }:Tokens) => {
  const jti = uuidV4();
  const accessToken = jwt.sign(
    {
      id: id,
      role: role,
      username
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "30m",
    }
  );
  redis.set(`accessToken:${id}:${jti}`, "1", "EX", 60 * 30);
  const refreshToken = jwt.sign(
    {
      id: id,
      role: role,
      username,
      jti,
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, //true in production, 
    sameSite: "lax", //change to strict in production,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return accessToken;
};
