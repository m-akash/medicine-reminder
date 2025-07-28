"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const db_config_1 = __importDefault(require("../config/db.config"));
const fcmUtils_1 = require("../utils/fcmUtils");
const date_fns_1 = require("date-fns");
const notificationUtils_1 = require("../utils/notificationUtils");
console.log("Medicine reminder scheduler module loaded");
function generateTodayTimes(frequency, today, reminderTimes) {
    const times = [];
    const freqArr = frequency.split("-").map(Number);
    // Parse reminderTimes (e.g., ["08:00", "14:00", "20:00"]) to [{hour, minute}]
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
    if (hour === 8)
        return "Morning";
    if (hour === 14)
        return "Afternoon";
    if (hour === 20)
        return "Evening";
    return "Dose";
}
node_cron_1.default.schedule("* * * * *", async () => {
    console.log(`Scheduler running at ${new Date().toLocaleTimeString()}`);
    const now = new Date();
    const todayStart = (0, date_fns_1.startOfDay)(now);
    const medicines = await db_config_1.default.medicine.findMany({
        include: {
            user: {
                include: {
                    settings: true,
                },
            },
            reminders: {
                where: { isActive: true },
                include: {
                    times: true,
                },
            },
        },
    });
    console.log(`Found ${medicines.length} medicines to process`);
    const userTimeGroups = new Map();
    for (const med of medicines) {
        if (!med.user?.fcmToken) {
            console.log(`Medicine ${med.name} has no FCM token for user ${med.userEmail}`);
            continue;
        }
        const userSettings = med.user.settings;
        let reminderTimes = ["08:00", "14:00", "20:00"];
        if (userSettings &&
            typeof userSettings.medicineDefaults === "object" &&
            userSettings.medicineDefaults) {
            const medicineDefaults = userSettings.medicineDefaults;
            if (Array.isArray(medicineDefaults.defaultReminderTimes)) {
                reminderTimes = medicineDefaults.defaultReminderTimes;
            }
        }
        if (userSettings &&
            typeof userSettings.notifications === "object" &&
            userSettings.notifications) {
            const notifications = userSettings.notifications;
            if (!notifications.enabled) {
                console.log(`Notifications disabled for user ${med.userEmail}, skipping medicine ${med.name}`);
                continue;
            }
        }
        console.log(`Processing medicine: ${med.name}`);
        console.log(`   - Frequency: ${med.frequency}`);
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
            userGroup.get(timeKey).push({
                medicine: med,
                time,
            });
        }
    }
    console.log(`Processing ${userTimeGroups.size} users`);
    for (const [fcmToken, timeGroups] of userTimeGroups) {
        console.log(`Processing user with ${timeGroups.size} time slots`);
        const allMissedMedicines = [];
        for (const [timeKey, medicinesAtTime] of timeGroups) {
            const doseTime = new Date(timeKey);
            console.log(`Processing time slot: ${doseTime.toLocaleTimeString()} with ${medicinesAtTime.length} medicines`);
            const takenStatuses = await Promise.all(medicinesAtTime.map(async ({ medicine }) => {
                const takenDay = await db_config_1.default.medicineTakenDay.findFirst({
                    where: { medicineId: medicine.id, date: todayStart },
                });
                const takenArr = takenDay?.taken?.split("-") || [];
                const userSettings = medicinesAtTime[0]?.medicine?.user?.settings;
                let reminderTimes = ["08:00", "14:00", "20:00"];
                if (userSettings &&
                    typeof userSettings.medicineDefaults === "object" &&
                    userSettings.medicineDefaults) {
                    const medicineDefaults = userSettings.medicineDefaults;
                    if (Array.isArray(medicineDefaults.defaultReminderTimes)) {
                        reminderTimes = medicineDefaults.defaultReminderTimes;
                    }
                }
                const todayTimes = generateTodayTimes(medicine.frequency || "0-0-0", now, reminderTimes);
                const doseIndex = todayTimes.findIndex((t) => Math.abs(t.getTime() - doseTime.getTime()) < 60000);
                const taken = takenArr[doseIndex] === "1";
                console.log(`Medicine ${medicine.name} at index ${doseIndex}, taken: ${taken}, takenArr: [${takenArr.join(",")}]`);
                return {
                    medicine,
                    doseIndex,
                    taken,
                };
            }));
            const userSettings = medicinesAtTime[0]?.medicine?.user?.settings;
            let reminderAdvance = 0;
            if (userSettings &&
                typeof userSettings.notifications === "object" &&
                userSettings.notifications) {
                const notifications = userSettings.notifications;
                reminderAdvance = notifications.reminderAdvance || 0;
            }
            const upcomingTime = (0, date_fns_1.addMinutes)(doseTime, -reminderAdvance);
            const upcomingDiff = Math.abs(now.getTime() - upcomingTime.getTime());
            if (reminderAdvance > 0 &&
                (0, date_fns_1.isAfter)(doseTime, now) &&
                upcomingDiff < 60000) {
                const doseTimeName = getDoseTimeName(doseTime);
                const medicineNames = medicinesAtTime
                    .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
                    .join(", ");
                console.log(`[NOTIFY-UPCOMING] fcmToken: ${fcmToken} | medicines: ${medicineNames} | doseTime: ${doseTime.toISOString()} | type: upcoming`);
                await (0, fcmUtils_1.sendFCMNotification)(fcmToken, "Upcoming Medicine Reminder", `Take your (${doseTimeName.toLowerCase()} dose) medicines: ${medicineNames} at ${doseTime.toLocaleTimeString()}`);
            }
            const currentDiff = Math.abs(now.getTime() - doseTime.getTime());
            if (currentDiff < 60000) {
                const doseTimeName = getDoseTimeName(doseTime);
                const medicineNames = medicinesAtTime
                    .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
                    .join(", ");
                console.log(`[NOTIFY-CURRENT] fcmToken: ${fcmToken} | medicines: ${medicineNames} | doseTime: ${doseTime.toISOString()} | type: current`);
                await (0, fcmUtils_1.sendFCMNotification)(fcmToken, "Time to Take Medicine", `It's time to take your (${doseTimeName.toLowerCase()} dose) medicines: ${medicineNames}!`);
                for (const { medicine } of medicinesAtTime) {
                    try {
                        await (0, notificationUtils_1.createMedicineReminderNotification)(medicine.userEmail, medicine.name, medicine.dosage || "", doseTimeName, medicine.id);
                    }
                    catch (error) {
                        console.error(`Error creating notification for ${medicine.name}:`, error);
                    }
                }
            }
            const missedTime = (0, date_fns_1.addMinutes)(doseTime, 60);
            const missedDiff = Math.abs(now.getTime() - missedTime.getTime());
            if ((0, date_fns_1.isAfter)(now, missedTime) && missedDiff < 60000) {
                const untakenMedicines = takenStatuses
                    .filter((status) => !status.taken)
                    .map((status) => status.medicine);
                untakenMedicines.forEach((medicine) => {
                    allMissedMedicines.push({ medicine, doseTime });
                });
            }
        }
        if (allMissedMedicines.length > 0) {
            const userSettings = allMissedMedicines[0]?.medicine?.user?.settings;
            let missedDoseAlertsEnabled = true;
            if (userSettings &&
                typeof userSettings.notifications === "object" &&
                userSettings.notifications) {
                const notifications = userSettings.notifications;
                missedDoseAlertsEnabled = notifications.missedDoseAlerts !== false;
            }
            if (missedDoseAlertsEnabled) {
                const medicinesByDoseTime = new Map();
                allMissedMedicines.forEach(({ medicine, doseTime }) => {
                    const doseTimeName = getDoseTimeName(doseTime);
                    if (!medicinesByDoseTime.has(doseTimeName)) {
                        medicinesByDoseTime.set(doseTimeName, []);
                    }
                    medicinesByDoseTime.get(doseTimeName).push(medicine);
                });
                const doseTimeMessages = Array.from(medicinesByDoseTime.entries()).map(([doseTimeName, medicines]) => {
                    const medicineNames = medicines
                        .map((medicine) => `${medicine.name}(${medicine.dosage})`)
                        .join(", ");
                    return `You missed your (${doseTimeName.toLowerCase()} dose) medicines: ${medicineNames}`;
                });
                const message = doseTimeMessages.join(". ") +
                    ". Please take them as soon as possible!";
                console.log(`[NOTIFY-MISSED] fcmToken: ${fcmToken} | medicines: ${Array.from(medicinesByDoseTime.values())
                    .flat()
                    .map((m) => m.name)
                    .join(", ")} | type: missed | message: ${message}`);
                await (0, fcmUtils_1.sendFCMNotification)(fcmToken, "Missed Medicine Reminder", message);
                // Create a single database notification for all missed medicines
                try {
                    const userEmail = allMissedMedicines[0]?.medicine?.userEmail;
                    const medicineNames = allMissedMedicines
                        .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
                        .join(", ");
                    await (0, notificationUtils_1.createMissedDoseNotification)(userEmail, medicineNames, "", "Missed Dose", undefined);
                }
                catch (error) {
                    console.error(`Error creating missed dose notification for group:`, error);
                }
            }
        }
    }
});
