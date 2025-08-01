import prisma from "../config/db.config";
import { sendFCMNotification } from "../utils/fcmUtils";
import { addMinutes, subMinutes, startOfDay } from "date-fns";
import {
  createMedicineReminderNotification,
  createMissedDoseNotification,
} from "../utils/notificationUtils";

type UserSettings = {
  medicineDefaults?: {
    defaultReminderTimes?: string[];
  };
  notifications?: {
    enabled?: boolean;
    reminderAdvance?: number;
    missedDoseAlerts?: boolean;
  };
};

function generateTodayTimes(
  frequency: string,
  today: Date,
  reminderTimes: string[]
): Date[] {
  const times: Date[] = [];
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

function getDoseTimeName(time: Date): string {
  const hour = time.getHours();
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 18) return "Afternoon";
  if (hour >= 18 || hour < 5) return "Evening";
  return "Dose";
}

/**
 * Updates a flag in a state string (e.g., "0-0-0") at a specific index.
 * @param originalString The original state string.
 * @param index The index to update.
 * @param flag The new flag ('1' for sent, 'M' for missed).
 * @param doseCount The total number of doses to ensure array length.
 * @returns The updated state string.
 */
function updateStateString(
  originalString: string,
  index: number,
  flag: string,
  doseCount: number
): string {
  const arr = originalString.split("-");
  while (arr.length < doseCount) {
    arr.push("0");
  }
  if (index < arr.length) {
    arr[index] = flag;
  }
  return arr.join("-");
}

export async function processMedicineReminders() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const CRON_WINDOW_MINUTES = 5; // Should match the GitHub Actions schedule
  const MISSED_DOSE_THRESHOLD_MINUTES = 60;
  const windowStart = subMinutes(now, CRON_WINDOW_MINUTES);

  const medicines = await prisma.medicine.findMany({
    include: {
      user: {
        include: { settings: true },
      },
    },
  });

  console.log(`[Scheduler] Found ${medicines.length} medicines to process`);

  for (const medicine of medicines) {
    const { user, frequency } = medicine;
    if (!user?.fcmToken) {
      console.log(
        `[Scheduler] Skipping ${medicine.name}: User has no FCM token.`
      );
      continue;
    }

    const userSettings: UserSettings = (user.settings as UserSettings) || {};
    if (userSettings.notifications?.enabled === false) {
      console.log(
        `[Scheduler] Skipping ${medicine.name}: Notifications disabled for ${user.email}.`
      );
      continue;
    }

    const reminderTimes: string[] = userSettings.medicineDefaults
      ?.defaultReminderTimes ?? ["08:00", "14:00", "20:00"];
    const todayTimes = generateTodayTimes(
      frequency || "0-0-0",
      now,
      reminderTimes
    );

    if (todayTimes.length === 0) continue;

    const takenDay = await prisma.medicineTakenDay.upsert({
      where: { medicineId_date: { medicineId: medicine.id, date: todayStart } },
      update: {},
      create: {
        medicineId: medicine.id,
        date: todayStart,
        taken: "0".repeat(todayTimes.length).split("").join("-"),
        remindersSent: "0".repeat(todayTimes.length).split("").join("-"),
      },
    });

    let remindersSentArr = takenDay.remindersSent.split("-");
    let takenArr = takenDay.taken.split("-");
    let needsDbUpdate = false;

    for (const [doseIndex, doseTime] of todayTimes.entries()) {
      const isDue = doseTime >= windowStart && doseTime <= now;
      if (isDue && remindersSentArr[doseIndex] === "0") {
        console.log(
          `[NOTIFY-CURRENT] Sending reminder for ${medicine.name} at ${doseTime}`
        );
        const doseTimeName = getDoseTimeName(doseTime);
        await sendFCMNotification(
          user.fcmToken,
          `Time for your ${doseTimeName} dose`,
          `It's time to take ${medicine.name} (${medicine.dosage}).`
        );
        await createMedicineReminderNotification(
          user.email,
          medicine.name,
          medicine.dosage || "",
          doseTimeName,
          medicine.id
        );
        remindersSentArr = updateStateString(
          remindersSentArr.join("-"),
          doseIndex,
          "1",
          todayTimes.length
        ).split("-");
        needsDbUpdate = true;
      }

      // --- 2. Check for missed doses ---
      const missedDoseTime = addMinutes(
        doseTime,
        MISSED_DOSE_THRESHOLD_MINUTES
      );
      const isMissed = missedDoseTime >= windowStart && missedDoseTime <= now;
      if (
        isMissed &&
        takenArr[doseIndex] === "0" &&
        remindersSentArr[doseIndex] !== "M" &&
        userSettings.notifications?.missedDoseAlerts !== false
      ) {
        console.log(
          `[NOTIFY-MISSED] Sending missed dose alert for ${medicine.name} at ${doseTime}`
        );
        const doseTimeName = getDoseTimeName(doseTime);
        await sendFCMNotification(
          user.fcmToken,
          `Missed Dose`,
          `You missed your ${doseTimeName.toLowerCase()} dose of ${
            medicine.name
          }.`
        );
        await createMissedDoseNotification(
          user.email,
          medicine.name,
          medicine.dosage || "",
          doseTimeName,
          medicine.id
        );
        remindersSentArr = updateStateString(
          remindersSentArr.join("-"),
          doseIndex,
          "M",
          todayTimes.length
        ).split("-");
        needsDbUpdate = true;
      }
    }

    if (needsDbUpdate) {
      await prisma.medicineTakenDay.update({
        where: { id: takenDay.id },
        data: { remindersSent: remindersSentArr.join("-") },
      });
    }
  }
}
