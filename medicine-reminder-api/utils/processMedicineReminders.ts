import prisma from "../config/db.config";
import { sendFCMNotification } from "../utils/fcmUtils";
import { addMinutes, isAfter, startOfDay } from "date-fns";
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

export async function processMedicineReminders() {
  const now = new Date();
  const todayStart = startOfDay(now);

  const medicines = await prisma.medicine.findMany({
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

  const userTimeGroups = new Map<string, Map<string, any[]>>();

  for (const med of medicines) {
    if (!med.user?.fcmToken) continue;
    const userSettings: UserSettings =
      (med.user.settings as UserSettings) || {};

    let reminderTimes: string[] = userSettings.medicineDefaults
      ?.defaultReminderTimes ?? ["08:00", "14:00", "20:00"];

    if (userSettings.notifications?.enabled === false) {
      console.log(`Notifications disabled for ${med.userEmail}`);
      continue;
    }

    const userKey = med.user.fcmToken;
    if (!userTimeGroups.has(userKey)) {
      userTimeGroups.set(userKey, new Map());
    }

    const userGroup = userTimeGroups.get(userKey)!;
    const todayTimes = generateTodayTimes(
      med.frequency || "0-0-0",
      now,
      reminderTimes
    );

    for (const time of todayTimes) {
      const timeKey = time.toISOString();
      if (!userGroup.has(timeKey)) {
        userGroup.set(timeKey, []);
      }
      userGroup.get(timeKey)!.push({ medicine: med, time });
    }
  }

  console.log(`Processing ${userTimeGroups.size} users`);

  // Process each user's reminders
  for (const [fcmToken, timeGroups] of userTimeGroups) {
    const allMissedMedicines: { medicine: any; doseTime: Date }[] = [];

    for (const [timeKey, medicinesAtTime] of timeGroups) {
      const doseTime = new Date(timeKey);

      // Check each medicine's taken status
      const takenStatuses = await Promise.all(
        medicinesAtTime.map(async ({ medicine }) => {
          const takenDay = await prisma.medicineTakenDay.findFirst({
            where: { medicineId: medicine.id, date: todayStart },
          });
          const takenArr = takenDay?.taken?.split("-") || [];

          const userSettings: UserSettings =
            (medicine.user.settings as UserSettings) || {};
          const reminderTimes = userSettings.medicineDefaults
            ?.defaultReminderTimes ?? ["08:00", "14:00", "20:00"];
          const todayTimes = generateTodayTimes(
            medicine.frequency || "0-0-0",
            now,
            reminderTimes
          );
          const doseIndex = todayTimes.findIndex(
            (t) => Math.abs(t.getTime() - doseTime.getTime()) < 60000
          );
          const taken = takenArr[doseIndex] === "1";
          return { medicine, doseIndex, taken };
        })
      );

      // Notification timings
      const userSettings: UserSettings =
        (medicinesAtTime[0]?.medicine?.user?.settings as UserSettings) || {};
      const reminderAdvance = userSettings.notifications?.reminderAdvance ?? 30;

      const upcomingTime = addMinutes(doseTime, -reminderAdvance);
      const upcomingDiff = Math.abs(now.getTime() - upcomingTime.getTime());

      // ✅ Upcoming reminder
      if (isAfter(doseTime, now) && upcomingDiff < 30000) {
        const doseTimeName = getDoseTimeName(doseTime);
        const medicineNames = medicinesAtTime
          .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
          .join(", ");

        await sendFCMNotification(
          fcmToken,
          "Upcoming Medicine Reminder",
          `Take your ${doseTimeName.toLowerCase()} dose: ${medicineNames} at ${doseTime.toLocaleTimeString()}`
        );
      }

      // ✅ Current dose notification
      const currentDiff = Math.abs(now.getTime() - doseTime.getTime());
      if (currentDiff < 30000) {
        const doseTimeName = getDoseTimeName(doseTime);
        const medicineNames = medicinesAtTime
          .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
          .join(", ");

        await sendFCMNotification(
          fcmToken,
          "Time to Take Medicine",
          `It's time to take your ${doseTimeName.toLowerCase()} dose: ${medicineNames}!`
        );

        //Save notifications in DB
        for (const { medicine } of medicinesAtTime) {
          await createMedicineReminderNotification(
            medicine.userEmail,
            medicine.name,
            medicine.dosage || "",
            doseTimeName,
            medicine.id
          );
        }
      }

      //Missed dose check
      const missedTime = addMinutes(doseTime, 60);
      const missedDiff = Math.abs(now.getTime() - missedTime.getTime());
      if (isAfter(now, missedTime) && missedDiff < 30000) {
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
      const userSettings: UserSettings =
        (allMissedMedicines[0]?.medicine?.user?.settings as UserSettings) || {};

      if (userSettings.notifications?.missedDoseAlerts !== false) {
        const medicinesByDoseTime = new Map<string, any[]>();
        allMissedMedicines.forEach(({ medicine, doseTime }) => {
          const doseTimeName = getDoseTimeName(doseTime);
          if (!medicinesByDoseTime.has(doseTimeName)) {
            medicinesByDoseTime.set(doseTimeName, []);
          }
          medicinesByDoseTime.get(doseTimeName)!.push(medicine);
        });

        const message =
          Array.from(medicinesByDoseTime.entries())
            .map(([doseTimeName, medicines]) => {
              const medicineNames = medicines
                .map((medicine) => `${medicine.name}(${medicine.dosage})`)
                .join(", ");
              return `You missed your ${doseTimeName.toLowerCase()} dose: ${medicineNames}`;
            })
            .join(". ") + ". Please take them as soon as possible!";

        await sendFCMNotification(
          fcmToken,
          "Missed Medicine Reminder",
          message
        );

        const userEmail = allMissedMedicines[0]?.medicine?.userEmail;
        const medicineNames = allMissedMedicines
          .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
          .join(", ");
        await createMissedDoseNotification(
          userEmail,
          medicineNames,
          "",
          "Missed Dose",
          undefined
        );
      }
    }
  }
}
