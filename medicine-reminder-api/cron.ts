import dotenv from "dotenv";
dotenv.config();
console.log("Cron worker process started.");
console.log("Initializing schedulers...");
console.log(`Scheduler running at ${new Date().toLocaleTimeString()}`);
import "./schedulers/medicineReminder";
