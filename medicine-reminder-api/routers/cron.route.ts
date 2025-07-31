import { Router, Request, Response } from "express";
import { processMedicineReminders } from "../utils/processMedicineReminders";

const router = Router();

router.post("/sendMedicineReminders", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  if (token !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log(`Cron Triggered at ${new Date().toISOString()}`);
  try {
    await processMedicineReminders();
    res.status(200).json({ message: "Reminders processed successfully" });
  } catch (err: any) {
    console.error("Cron job error:", err);
    res
      .status(500)
      .json({ error: "Failed to process reminders", details: err.message });
  }
});

export default router;





