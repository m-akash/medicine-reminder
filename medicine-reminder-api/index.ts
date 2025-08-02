import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { startMedicineReminderCron } from "./schedulers/medicineReminder";

dotenv.config();

// --- Validate Environment Variables ---
const validateEnvironmentVariables = () => {
  const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET_KEY", "ALLOWED_ORIGINS"];
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
  if (missingVars.length > 0) {
    console.error(
      `FATAL ERROR: Missing required environment variables: ${missingVars.join(
        ", "
      )}`
    );
    process.exit(1);
  }
};
validateEnvironmentVariables();

const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET_KEY as string;
const jwtExpiresInSeconds = Number(process.env.JWT_EXPIRE_SECONDS) || 604800;
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS as string;

const app = express();

// --- CORS Configuration ---
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((origin) => origin.trim());
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// --- Middleware ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Routers ---
import userRouter from "./routers/user.route";
import medicineRouter from "./routers/medicine.route";
import notificationRouter from "./routers/notification.route";

app.use("/api", userRouter);
app.use("/api", medicineRouter);
app.use("/api", notificationRouter);

interface JwtRequestBody {
  email: string;
}
app.post("/jwt", (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .send({ error: "A valid email is required to generate token." });
    }

    const token = jwt.sign({ email } as JwtRequestBody, jwtSecret, {
      expiresIn: jwtExpiresInSeconds,
    });

    res.send({ token });
  } catch (error) {
    console.error("Error generating JWT:", error);
    res.status(500).send({ error: "An internal server error occurred." });
  }
});

app.get("/", (_: Request, res: Response) => {
  res.send("Medicine Reminder API is running!");
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);

  // ✅ Start cron AFTER server is ready
  startMedicineReminderCron();
});

export default app;
