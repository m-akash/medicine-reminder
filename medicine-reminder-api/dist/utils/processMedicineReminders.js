"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMedicineReminders = processMedicineReminders;
const db_config_1 = __importDefault(require("../config/db.config"));
const fcmUtils_1 = require("../utils/fcmUtils");
const date_fns_1 = require("date-fns");
const notificationUtils_1 = require("../utils/notificationUtils");
function generateTodayTimes(frequency, today, reminderTimes) {
    const times = [];
    const freqArr = frequency.split("-").map(Number);
    const defaultTimes = reminderTimes.map((t) => {
        const [hour, minute] = t.split(":").map(Number);
        return { hour, minute };
    });
    freqArr.forEach((dose, index) => {
        if (dose === 1 && defaultTimes[index]) {
            const time = new Date(today);
            time.setHours(defaultTimes[index].hour, defaultTimes[index].minute, 0, 0);
            times.push(time);
        }
    });
    return times.sort((a, b) => a.getTime() - b.getTime());
}
function getDoseTimeName(time) {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12)
        return "Morning";
    if (hour >= 12 && hour < 18)
        return "Afternoon";
    if (hour >= 18 || hour < 5)
        return "Evening";
    return "Dose";
}
async function processMedicineReminders() {
    const now = new Date();
    const todayStart = (0, date_fns_1.startOfDay)(now);
    const medicines = await db_config_1.default.medicine.findMany({
        include: {
            user: {
                include: { settings: true },
            },
            reminders: {
                where: { isActive: true },
                include: { times: true },
            },
        },
    });
    console.log(`[Scheduler] Found ${medicines.length} medicines to process`);
    const userTimeGroups = new Map();
    for (const med of medicines) {
        if (!med.user?.fcmToken)
            continue;
        const userSettings = med.user.settings || {};
        let reminderTimes = userSettings.medicineDefaults
            ?.defaultReminderTimes ?? ["08:00", "14:00", "20:00"];
        if (userSettings.notifications?.enabled === false) {
            console.log(`Notifications disabled for ${med.userEmail}`);
            continue;
        }
        const userKey = med.user.fcmToken;
        if (!userTimeGroups.has(userKey)) {
            userTimeGroups.set(userKey, new Map());
        }
        const userGroup = userTimeGroups.get(userKey);
        const todayTimes = generateTodayTimes(med.frequency || "0-0-0", now, reminderTimes);
        for (const time of todayTimes) {
            const timeKey = time.toISOString();
            if (!userGroup.has(timeKey)) {
                userGroup.set(timeKey, []);
            }
            userGroup.get(timeKey).push({ medicine: med, time });
        }
    }
    console.log(`Processing ${userTimeGroups.size} users`);
    // Process each user's reminders
    for (const [fcmToken, timeGroups] of userTimeGroups) {
        const allMissedMedicines = [];
        for (const [timeKey, medicinesAtTime] of timeGroups) {
            const doseTime = new Date(timeKey);
            // Check each medicine's taken status
            const takenStatuses = await Promise.all(medicinesAtTime.map(async ({ medicine }) => {
                const takenDay = await db_config_1.default.medicineTakenDay.findFirst({
                    where: { medicineId: medicine.id, date: todayStart },
                });
                const takenArr = takenDay?.taken?.split("-") || [];
                const userSettings = medicine.user.settings || {};
                const reminderTimes = userSettings.medicineDefaults
                    ?.defaultReminderTimes ?? ["08:00", "14:00", "20:00"];
                const todayTimes = generateTodayTimes(medicine.frequency || "0-0-0", now, reminderTimes);
                const doseIndex = todayTimes.findIndex((t) => Math.abs(t.getTime() - doseTime.getTime()) < 60000);
                const taken = takenArr[doseIndex] === "1";
                return { medicine, doseIndex, taken };
            }));
            // Notification timings
            const userSettings = medicinesAtTime[0]?.medicine?.user?.settings || {};
            const reminderAdvance = userSettings.notifications?.reminderAdvance ?? 30;
            const upcomingTime = (0, date_fns_1.addMinutes)(doseTime, -reminderAdvance);
            const upcomingDiff = Math.abs(now.getTime() - upcomingTime.getTime());
            // ✅ Upcoming reminder
            if ((0, date_fns_1.isAfter)(doseTime, now) && upcomingDiff < 30000) {
                const doseTimeName = getDoseTimeName(doseTime);
                const medicineNames = medicinesAtTime
                    .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
                    .join(", ");
                await (0, fcmUtils_1.sendFCMNotification)(fcmToken, "Upcoming Medicine Reminder", `Take your ${doseTimeName.toLowerCase()} dose: ${medicineNames} at ${doseTime.toLocaleTimeString()}`);
            }
            // ✅ Current dose notification
            const currentDiff = Math.abs(now.getTime() - doseTime.getTime());
            if (currentDiff < 30000) {
                const doseTimeName = getDoseTimeName(doseTime);
                const medicineNames = medicinesAtTime
                    .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
                    .join(", ");
                await (0, fcmUtils_1.sendFCMNotification)(fcmToken, "Time to Take Medicine", `It's time to take your ${doseTimeName.toLowerCase()} dose: ${medicineNames}!`);
                //Save notifications in DB
                for (const { medicine } of medicinesAtTime) {
                    await (0, notificationUtils_1.createMedicineReminderNotification)(medicine.userEmail, medicine.name, medicine.dosage || "", doseTimeName, medicine.id);
                }
            }
            //Missed dose check
            const missedTime = (0, date_fns_1.addMinutes)(doseTime, 60);
            const missedDiff = Math.abs(now.getTime() - missedTime.getTime());
            if ((0, date_fns_1.isAfter)(now, missedTime) && missedDiff < 30000) {
                const untakenMedicines = takenStatuses
                    .filter((status) => !status.taken)
                    .map((status) => status.medicine);
                untakenMedicines.forEach((medicine) => {
                    allMissedMedicines.push({ medicine, doseTime });
                });
            }
        }
        // ✅ Send missed dose summary
        if (allMissedMedicines.length > 0) {
            const userSettings = allMissedMedicines[0]?.medicine?.user?.settings || {};
            if (userSettings.notifications?.missedDoseAlerts !== false) {
                const medicinesByDoseTime = new Map();
                allMissedMedicines.forEach(({ medicine, doseTime }) => {
                    const doseTimeName = getDoseTimeName(doseTime);
                    if (!medicinesByDoseTime.has(doseTimeName)) {
                        medicinesByDoseTime.set(doseTimeName, []);
                    }
                    medicinesByDoseTime.get(doseTimeName).push(medicine);
                });
                const message = Array.from(medicinesByDoseTime.entries())
                    .map(([doseTimeName, medicines]) => {
                    const medicineNames = medicines
                        .map((medicine) => `${medicine.name}(${medicine.dosage})`)
                        .join(", ");
                    return `You missed your ${doseTimeName.toLowerCase()} dose: ${medicineNames}`;
                })
                    .join(". ") + ". Please take them as soon as possible!";
                await (0, fcmUtils_1.sendFCMNotification)(fcmToken, "Missed Medicine Reminder", message);
                const userEmail = allMissedMedicines[0]?.medicine?.userEmail;
                const medicineNames = allMissedMedicines
                    .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
                    .join(", ");
                await (0, notificationUtils_1.createMissedDoseNotification)(userEmail, medicineNames, "", "Missed Dose", undefined);
            }
        }
    }
}
