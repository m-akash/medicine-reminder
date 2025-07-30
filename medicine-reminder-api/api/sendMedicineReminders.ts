import type { VercelRequest, VercelResponse } from "@vercel/node";
import { processMedicineReminders } from "../utils/processMedicineReminders";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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
    res.status(500).json({ error: err.message });
  }
}
