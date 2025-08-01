import dotenv from "dotenv";
dotenv.config();

// Import the actual logic from your scheduler file
import { sendMedicineReminders } from "./schedulers/medicineReminder";

async function main() {
  console.log(`[${new Date().toISOString()}] Starting scheduled reminder job.`);
  try {
    await sendMedicineReminders();
    console.log(`[${new Date().toISOString()}] Reminder job finished successfully.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] An error occurred during the reminder job:`, error);
    process.exit(1); // Exit with a non-zero code to signal failure to Render
  }
}

main();
