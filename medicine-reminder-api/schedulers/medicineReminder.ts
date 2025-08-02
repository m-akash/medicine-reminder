import cron from "node-cron";
import { processMedicineReminders } from "./processMedicineReminders";

let cronStarted = false;

export function startMedicineReminderCron() {
  if (cronStarted) {
    console.log(
      "Medicine reminder cron already started, skipping duplicate start."
    );
    return;
  }

  console.log("Medicine reminder scheduler initialized.");
  cronStarted = true;

  cron.schedule("*/5 * * * *", async () => {
    console.log(
      `[node-cron] Scheduler Running medicine reminder job at ${new Date().toLocaleTimeString()}`
    );
    try {
      await processMedicineReminders();
    } catch (err) {
      console.error("[node-cron] Medicine reminder job failed:", err);
    }
  });
}
