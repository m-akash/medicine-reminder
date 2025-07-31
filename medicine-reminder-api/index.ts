import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import JWT from "./config/jwt.config";
dotenv.config();

const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET_KEY;
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;

if (!jwtSecret) {
  console.error(
    "FATAL ERROR: JWT_SECRET is not defined in environment variables."
  );
  process.exit(1);
}

if (!allowedOriginsEnv) {
  console.error(
    "FATAL ERROR: ALLOWED_ORIGINS is not defined in environment variables. e.g., 'https://mediping.netlify.app,http://localhost:3000'"
  );
  process.exit(1);
}

// --- Routers ---
import userRouter from "./routers/user.route";
import medicineRouter from "./routers/medicine.route";
import notificationRouter from "./routers/notification.route";
import cronRouter from "./routers/cron.route";

const app = express();

// --- CORS Configuration ---
const allowedOrigins = allowedOriginsEnv.split(",");
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// --- Middleware ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
app.use("/api", userRouter);
app.use("/api", medicineRouter);
app.use("/api", notificationRouter);
app.use("/api", cronRouter); // Add the cron router

// --- JWT Token Generation Route ---
app.post("/jwt", async (req: Request, res: Response) => {
  const user = req.body;
  if (!JWT.jwtSecret) {
    return res.status(500).json({ error: "JWT secret not configured" });
  }
  const token = jwt.sign(
    user,
    JWT.jwtSecret as string,
    { expiresIn: JWT.jwtExpire } as jwt.SignOptions
  );
  res.send({ token });
});

app.get("/", (_: Request, res: Response) => {
  res.send("Medicine Reminder API is running!");
});

export default app;
