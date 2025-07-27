import app from "./app";
import dotenv from "dotenv";
import "./schedulers/medicineReminder";
dotenv.config();

const port: number | string = process.env["PORT"] || 3001;

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`✅ Medicine reminder scheduler started`);
});
