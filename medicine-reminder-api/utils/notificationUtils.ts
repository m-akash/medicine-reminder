import prisma from "../config/db.config";
export interface CreateNotificationData {
  userEmail: string;
  title: string;
  message: string;
  type: "reminder" | "missed_dose" | "refill" | "system" | "success";
  medicineId?: string;
  medicineName?: string;
}

export const createNotification = async (data: CreateNotificationData) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userEmail: data.userEmail,
        title: data.title,
        message: data.message,
        type: data.type,
        medicineId: data.medicineId,
        medicineName: data.medicineName,
      },
    });

    console.log(
      `Notification created: ${notification.title} for ${data.userEmail}`
    );
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};



export const createMedicineReminderNotification = async (
  userEmail: string,
  medicineName: string,
  dosage: string,
  doseTime: string,
  medicineId?: string
) => {
  return createNotification({
    userEmail,
    title: "Medicine Reminder",
    message: `Time to take your ${doseTime.toLowerCase()} dose of ${medicineName} (${dosage})`,
    type: "reminder",
    medicineId,
    medicineName,
  });
};

export const createMissedDoseNotification = async (
  userEmail: string,
  medicineName: string,
  dosage: string,
  doseTime: string,
  medicineId?: string
) => {
  return createNotification({
    userEmail,
    title: "Missed Dose Alert",
    message: `You missed your ${doseTime.toLowerCase()} dose of ${medicineName} (${dosage}). Please take it as soon as possible.`,
    type: "missed_dose",
    medicineId,
    medicineName,
  });
};

export const createRefillReminderNotification = async (
  userEmail: string,
  medicineName: string,
  remainingDays: number,
  medicineId?: string
) => {
  return createNotification({
    userEmail,
    title: "Refill Reminder",
    message: `Your prescription for ${medicineName} is running low. You have approximately ${remainingDays} days left. Please refill your prescription.`,
    type: "refill",
    medicineId,
    medicineName,
  });
};

export const createSuccessNotification = async (
  userEmail: string,
  title: string,
  message: string,
  medicineName?: string,
  medicineId?: string
) => {
  return createNotification({
    userEmail,
    title,
    message,
    type: "success",
    medicineId,
    medicineName,
  });
};

export const createSystemNotification = async (
  userEmail: string,
  title: string,
  message: string
) => {
  return createNotification({
    userEmail,
    title,
    message,
    type: "system",
  });
};
