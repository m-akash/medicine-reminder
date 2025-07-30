"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const processMedicineReminders_1 = require("../utils/processMedicineReminders");
async function handler(req, res) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    if (!token || token !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(`Cron Triggered at ${new Date().toLocaleTimeString()}`);
    try {
        await (0, processMedicineReminders_1.processMedicineReminders)();
        res.status(200).json({ message: "Reminders processed successfully" });
    }
    catch (err) {
        console.error("Cron job error:", err);
        res.status(500).json({ error: err.message });
    }
}
