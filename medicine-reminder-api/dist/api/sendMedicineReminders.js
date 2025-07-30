"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const processMedicineReminders_1 = require("../utils/processMedicineReminders");
async function handler(req, res) {
    console.log(`Vercel Cron Triggered at ${new Date().toLocaleTimeString()}`);
    try {
        await (0, processMedicineReminders_1.processMedicineReminders)();
        res.status(200).json({ message: "Reminders processed successfully" });
    }
    catch (err) {
        console.error("Cron job error:", err);
        res.status(500).json({ error: err.message });
    }
}
