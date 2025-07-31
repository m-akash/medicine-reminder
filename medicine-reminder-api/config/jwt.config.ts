import dotenv from "dotenv";
dotenv.config();

interface JwtConfig {
  jwtSecret: string | undefined;
  jwtExpire: string;
}

const JWT: JwtConfig = {
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpire: "24h",
};

export default JWT;
