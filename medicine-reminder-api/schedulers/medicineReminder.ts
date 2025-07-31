// cron-local.ts
import cron from "node-cron";
import { processMedicineReminders } from "./processMedicineReminders";

console.log("Local cron started...");

export const localCron = cron.schedule("*/5 * * * *", async () => {
  console.log(`Scheduler running at ${new Date().toLocaleTimeString()}`);
  await processMedicineReminders();
});
