import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processMedicineReminders } from "../utils/processMedicineReminders";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== process.env.CRON_SECRET) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }

  console.log(`Vercel Cron Triggered at ${new Date().toLocaleTimeString()}`);

  try {
    await processMedicineReminders();
    res.status(200).json({ message: "Reminders processed successfully" });
  } catch (err: any) {
    console.error("Cron job error:", err);
    res.status(500).json({ error: err.message });
  }
}
