import app from "./app";
import dotenv from "dotenv";
import "./schedulers/medicineReminder";
dotenv.config();

const port: number | string = process.env["PORT"] || 3001;

export default app;
