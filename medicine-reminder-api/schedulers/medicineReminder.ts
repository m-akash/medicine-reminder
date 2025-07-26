import cron from "node-cron";
import prisma from "../config/db.config";
import { sendFCMNotification } from "../utils/fcmUtils";
import { addMinutes, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

console.log("🚀 Medicine reminder scheduler module loaded");

cron.schedule("* * * * *", async () => {
  console.log(`🕐 Scheduler running at ${new Date().toLocaleTimeString()}`);
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const medicines = await prisma.medicine.findMany({
    include: {
      user: true,
      reminders: {
        where: { isActive: true },
        include: {
          times: true,
        },
      },
    },
  });

  for (const med of medicines) {
    if (!med.user?.fcmToken) continue;
    for (const reminder of med.reminders) {
      const times = reminder.times
        .map((t) => new Date(t.time))
        .filter((t) => t >= todayStart && t <= todayEnd)
        .sort((a, b) => a.getTime() - b.getTime());
      if (times.length === 0) continue;

      const takenDay = await prisma.medicineTakenDay.findFirst({
        where: { medicineId: med.id, date: todayStart },
      });
      const takenArr = takenDay?.taken?.split("-") || [];

      for (let i = 0; i < times.length; i++) {
        const doseTime = times[i];
        const taken = takenArr[i] === "1";
        if (
          isAfter(doseTime, now) &&
          Math.abs(now.getTime() - addMinutes(doseTime, -30).getTime()) < 60000
        ) {
          await sendFCMNotification(
            med.user.fcmToken,
            "Upcoming Medicine Reminder",
            `Take your ${med.name}(${
              med.dosage
            }) at ${doseTime.toLocaleTimeString()}`
          );
        }

        if (Math.abs(now.getTime() - doseTime.getTime()) < 60000) {
          await sendFCMNotification(
            med.user.fcmToken,
            "Time to Take Medicine",
            `It's time to take your ${med.name}(${med.dosage})!`
          );
        }

        if (
          !taken &&
          isAfter(now, addMinutes(doseTime, 60)) &&
          Math.abs(now.getTime() - addMinutes(doseTime, 60).getTime()) < 60000
        ) {
          await sendFCMNotification(
            med.user.fcmToken,
            "Missed Medicine Reminder",
            `You missed your ${med.name}(${med.dosage}). Please take it as soon as possible!`
          );
        }
      }
    }
  }
});
