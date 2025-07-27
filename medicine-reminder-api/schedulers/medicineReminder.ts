import cron from "node-cron";
import prisma from "../config/db.config";
import { sendFCMNotification } from "../utils/fcmUtils";
import { addMinutes, isAfter, startOfDay } from "date-fns";
import {
  createMedicineReminderNotification,
  createMissedDoseNotification,
} from "../utils/notificationUtils";

console.log("Medicine reminder scheduler module loaded");

function generateTodayTimes(frequency: string, today: Date): Date[] {
  const times: Date[] = [];
  const freqArr = frequency.split("-").map(Number);

  const defaultTimes = [
    { hour: 8, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 20, minute: 0 },
  ];

  freqArr.forEach((dose, index) => {
    if (dose === 1) {
      const time = new Date(today);
      time.setHours(defaultTimes[index].hour, defaultTimes[index].minute, 0, 0);
      times.push(time);
    }
  });

  return times.sort((a, b) => a.getTime() - b.getTime());
}

function getDoseTimeName(time: Date): string {
  const hour = time.getHours();
  if (hour === 8) return "Morning";
  if (hour === 14) return "Afternoon";
  if (hour === 20) return "Evening";
  return "Dose";
}

cron.schedule("* * * * *", async () => {
  console.log(`Scheduler running at ${new Date().toLocaleTimeString()}`);
  const now = new Date();
  const todayStart = startOfDay(now);

  const medicines = await prisma.medicine.findMany({
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

  const userTimeGroups = new Map<string, Map<string, any[]>>();

  for (const med of medicines) {
    if (!med.user?.fcmToken) {
      console.log(
        `Medicine ${med.name} has no FCM token for user ${med.userEmail}`
      );
      continue;
    }

    const userSettings = med.user.settings;
    if (
      userSettings &&
      typeof userSettings.notifications === "object" &&
      userSettings.notifications
    ) {
      const notifications = userSettings.notifications as any;
      if (!notifications.enabled) {
        console.log(
          `Notifications disabled for user ${med.userEmail}, skipping medicine ${med.name}`
        );
        continue;
      }
    }

    console.log(`Processing medicine: ${med.name}`);
    console.log(`   - Frequency: ${med.frequency}`);

    const userKey = med.user.fcmToken;
    if (!userTimeGroups.has(userKey)) {
      userTimeGroups.set(userKey, new Map());
    }

    const userGroup = userTimeGroups.get(userKey)!;
    const todayTimes = generateTodayTimes(med.frequency || "0-0-0", now);

    for (const time of todayTimes) {
      const timeKey = time.toISOString();
      if (!userGroup.has(timeKey)) {
        userGroup.set(timeKey, []);
      }
      userGroup.get(timeKey)!.push({
        medicine: med,
        time,
      });
    }
  }

  console.log(`Processing ${userTimeGroups.size} users`);

  for (const [fcmToken, timeGroups] of userTimeGroups) {
    console.log(`Processing user with ${timeGroups.size} time slots`);

    const allMissedMedicines: { medicine: any; doseTime: Date }[] = [];

    for (const [timeKey, medicinesAtTime] of timeGroups) {
      const doseTime = new Date(timeKey);
      console.log(
        `Processing time slot: ${doseTime.toLocaleTimeString()} with ${
          medicinesAtTime.length
        } medicines`
      );

      const takenStatuses = await Promise.all(
        medicinesAtTime.map(async ({ medicine }) => {
          const takenDay = await prisma.medicineTakenDay.findFirst({
            where: { medicineId: medicine.id, date: todayStart },
          });
          const takenArr = takenDay?.taken?.split("-") || [];

          const todayTimes = generateTodayTimes(
            medicine.frequency || "0-0-0",
            now
          );
          const doseIndex = todayTimes.findIndex(
            (t) => Math.abs(t.getTime() - doseTime.getTime()) < 60000
          );

          const taken = takenArr[doseIndex] === "1";

          console.log(
            `Medicine ${
              medicine.name
            } at index ${doseIndex}, taken: ${taken}, takenArr: [${takenArr.join(
              ","
            )}]`
          );

          return {
            medicine,
            doseIndex,
            taken,
          };
        })
      );
      const userSettings = medicinesAtTime[0]?.medicine?.user?.settings;
      let reminderAdvance = 0;

      if (
        userSettings &&
        typeof userSettings.notifications === "object" &&
        userSettings.notifications
      ) {
        const notifications = userSettings.notifications as any;
        reminderAdvance = notifications.reminderAdvance || 0;
      }

      const upcomingTime = addMinutes(doseTime, -reminderAdvance);
      const upcomingDiff = Math.abs(now.getTime() - upcomingTime.getTime());
      if (
        reminderAdvance > 0 &&
        isAfter(doseTime, now) &&
        upcomingDiff < 60000
      ) {
        const doseTimeName = getDoseTimeName(doseTime);
        const medicineNames = medicinesAtTime
          .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
          .join(", ");

        console.log(
          `[NOTIFY-UPCOMING] fcmToken: ${fcmToken} | medicines: ${medicineNames} | doseTime: ${doseTime.toISOString()} | type: upcoming`
        );
        await sendFCMNotification(
          fcmToken,
          "Upcoming Medicine Reminder",
          `Take your (${doseTimeName.toLowerCase()} dose) medicines: ${medicineNames} at ${doseTime.toLocaleTimeString()}`
        );
      }

      const currentDiff = Math.abs(now.getTime() - doseTime.getTime());
      if (currentDiff < 60000) {
        const doseTimeName = getDoseTimeName(doseTime);
        const medicineNames = medicinesAtTime
          .map(({ medicine }) => `${medicine.name}(${medicine.dosage})`)
          .join(", ");

        console.log(
          `[NOTIFY-CURRENT] fcmToken: ${fcmToken} | medicines: ${medicineNames} | doseTime: ${doseTime.toISOString()} | type: current`
        );
        await sendFCMNotification(
          fcmToken,
          "Time to Take Medicine",
          `It's time to take your (${doseTimeName.toLowerCase()} dose) medicines: ${medicineNames}!`
        );

        for (const { medicine } of medicinesAtTime) {
          try {
            await createMedicineReminderNotification(
              medicine.userEmail,
              medicine.name,
              medicine.dosage || "",
              doseTimeName,
              medicine.id
            );
          } catch (error) {
            console.error(
              `Error creating notification for ${medicine.name}:`,
              error
            );
          }
        }
      }

      const missedTime = addMinutes(doseTime, 60);
      const missedDiff = Math.abs(now.getTime() - missedTime.getTime());
      if (isAfter(now, missedTime) && missedDiff < 60000) {
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

      if (
        userSettings &&
        typeof userSettings.notifications === "object" &&
        userSettings.notifications
      ) {
        const notifications = userSettings.notifications as any;
        missedDoseAlertsEnabled = notifications.missedDoseAlerts !== false;
      }

      if (missedDoseAlertsEnabled) {
        const medicinesByDoseTime = new Map<string, any[]>();
        allMissedMedicines.forEach(({ medicine, doseTime }) => {
          const doseTimeName = getDoseTimeName(doseTime);
          if (!medicinesByDoseTime.has(doseTimeName)) {
            medicinesByDoseTime.set(doseTimeName, []);
          }
          medicinesByDoseTime.get(doseTimeName)!.push(medicine);
        });
        const doseTimeMessages = Array.from(medicinesByDoseTime.entries()).map(
          ([doseTimeName, medicines]) => {
            const medicineNames = medicines
              .map((medicine) => `${medicine.name}(${medicine.dosage})`)
              .join(", ");
            return `You missed your (${doseTimeName.toLowerCase()} dose) medicines: ${medicineNames}`;
          }
        );

        const message =
          doseTimeMessages.join(". ") +
          ". Please take them as soon as possible!";

        console.log(
          `[NOTIFY-MISSED] fcmToken: ${fcmToken} | medicines: ${Array.from(
            medicinesByDoseTime.values()
          )
            .flat()
            .map((m) => m.name)
            .join(", ")} | type: missed | message: ${message}`
        );
        await sendFCMNotification(
          fcmToken,
          "Missed Medicine Reminder",
          message
        );

        // Create a single database notification for all missed medicines
        try {
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
        } catch (error) {
          console.error(
            `Error creating missed dose notification for group:`,
            error
          );
        }
      }
    }
  }
});
