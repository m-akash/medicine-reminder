import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processMedicineReminders } from "../utils/processMedicineReminders";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token || token !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log(`Cron Triggered at ${new Date().toLocaleTimeString()}`);

  try {
    await processMedicineReminders();
    res.status(200).json({ message: "Reminders processed successfully" });
  } catch (err: any) {
    console.error("Cron job error:", err);
    res.status(500).json({ error: err.message });
  }
}
