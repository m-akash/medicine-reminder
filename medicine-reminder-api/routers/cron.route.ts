import { Router, Request, Response } from "express";
import { processMedicineReminders } from "../schedulers/processMedicineReminders";

const router = Router();

/**
 * @route   POST /api/sendMedicineReminders
 * @desc    Secure endpoint for external cron jobs (like GitHub Actions) to trigger reminder processing.
 * @access  Private (requires CRON_SECRET)
 */
router.post("/sendMedicineReminders", async (req: Request, res: Response) => {
  // 1. Authorize the request using the secret from environment variables
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("CRON job: Unauthorized attempt to access reminder endpoint.");
    return res.status(401).json({ message: "Unauthorized" });
  }

  // 2. Execute the main reminder processing logic
  try {
    console.log(
      "CRON job: Endpoint triggered successfully. Starting reminder processing..."
    );
    await processMedicineReminders();
    console.log("CRON job: Reminder processing finished successfully.");
    return res
      .status(200)
      .json({ message: "Medicine reminders processed successfully." });
  } catch (error) {
    console.error(
      "CRON job: An error occurred while processing reminders:",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
