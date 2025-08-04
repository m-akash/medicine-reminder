import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import JWT from "../config/jwt.config";

interface DecodedToken {
  email: string;
  [key: string]: any;
}

interface AuthenticatedRequest extends Request {
  decoded?: DecodedToken;
}

const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  if (!JWT.jwtSecret) {
    return res.status(500).send({ message: "JWT secret not configured" });
  }

  return jwt.verify(token, JWT.jwtSecret, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded as DecodedToken;
    return next();
  });
};

export default verifyToken;
