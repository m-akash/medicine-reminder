import { processMedicineReminders } from "./processMedicineReminders";

/**
 * A wrapper function to execute the medicine reminder processing logic.
 * This function is intended to be called by a script that is run by a scheduler (e.g., Render Cron Job).
 */
export async function sendMedicineReminders() {
  console.log(
    `[Task Start] Executing medicine reminder processing at ${new Date().toISOString()}`
  );
  await processMedicineReminders();
  console.log(
    `[Task End] Finished medicine reminder processing at ${new Date().toISOString()}`
  );
}

// import cron from "node-cron";
// import { processMedicineReminders } from "./processMedicineReminders";

// console.log("Local cron started...");

// cron.schedule("*/5 * * * *", async () => {
//   console.log(`Scheduler running at ${new Date().toLocaleTimeString()}`);
//   await processMedicineReminders();
// });
