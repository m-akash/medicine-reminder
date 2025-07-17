import dotenv from "dotenv";
dotenv.config();

interface JwtConfig {
  jwtSecret: string | undefined;
  jswExpire: string;
}

const JWT: JwtConfig = {
  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
  jswExpire: "30d",
};

export default JWT;
