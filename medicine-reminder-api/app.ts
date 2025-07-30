import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import JWT from "./config/jwt.config";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "https://mediping.netlify.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import userRouter from "./routers/user.route";
app.use("/api", userRouter);

import medicineRouter from "./routers/medicine.route";
app.use("/api", medicineRouter);

import notificationRouter from "./routers/notification.route";
app.use("/api", notificationRouter);

app.post("/jwt", async (req: Request, res: Response) => {
  const user = req.body;
  if (!JWT.jwtSecret) {
    return res.status(500).json({ error: "JWT secret not configured" });
  }
  const token = jwt.sign(
    user,
    JWT.jwtSecret as string,
    { expiresIn: JWT.jswExpire } as jwt.SignOptions
  );
  res.send({ token });
});

app.get("/", async (_: Request, res: Response) => {
  res.send("Hello");
});

export default app;
