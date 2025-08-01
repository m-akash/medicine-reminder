import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
dotenv.config();

const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET_KEY;
const jwtExpiresInSeconds = Number(process.env.JWT_EXPIRE_SECONDS) || 604800;
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;

if (!jwtSecret) {
  console.error(
    "FATAL ERROR: JWT_SECRET_KEY is not defined in environment variables."
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

const app = express();

// --- CORS Configuration ---
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((origin) => origin.trim());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      callback(new Error(msg));
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

interface JwtRequestBody {
  email: string;
}
app.post("/jwt", (req: Request, res: Response) => {
  const userPayload: JwtRequestBody = {
    email: req.body.email,
  };

  if (!userPayload.email) {
    return res
      .status(400)
      .send({ error: "Email is required to generate a token." });
  }
  const token = jwt.sign(userPayload, jwtSecret as string, {
    expiresIn: jwtExpiresInSeconds,
  });

  res.send({ token });
});

app.get("/", (_: Request, res: Response) => {
  res.send("Medicine Reminder API is running!");
});

console.log("Server is running");
export default app;
