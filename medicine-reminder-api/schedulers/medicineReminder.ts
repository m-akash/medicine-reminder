import cron from "node-cron";
import { processMedicineReminders } from "./processMedicineReminders";

console.log("Medicine reminder scheduler initialized.");

// This schedule runs every 5 minutes.
// The job will be managed by node-cron within the long-running worker process.
cron.schedule("*/5 * * * *", async () => {
  console.log(`[node-cron] Running medicine reminder job at ${new Date().toISOString()}`);
  await processMedicineReminders();
});
