import { Request, Response } from "express";
import prisma from "../config/db.config";
import { parseISO, startOfDay } from "date-fns";

const createLocalDateTime = (dateStr: string, timeStr: string): Date => {
  console.log("Creating local date time with:", { dateStr, timeStr });

  if (!dateStr || !timeStr) {
    console.error("Invalid date or time string:", { dateStr, timeStr });
    throw new Error("Invalid date or time string");
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  console.log("Parsed values:", { year, month, day, hour, minute });

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hour) ||
    isNaN(minute)
  ) {
    console.error("Invalid numeric values:", {
      year,
      month,
      day,
      hour,
      minute,
    });
    throw new Error("Invalid numeric values for date/time");
  }

  const date = new Date(year, month - 1, day, hour, minute, 0, 0);

  if (isNaN(date.getTime())) {
    console.error("Invalid date created:", date);
    throw new Error("Invalid date created");
  }

  console.log("Created date:", date);
  return date;
};

const getMedicineByEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const findMedicine = await prisma.medicine.findMany({
      where: { userEmail: req.params.userEmail },
    });
    if (findMedicine.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Your medicine list is empty now!" });
    }
    return res.status(200).json({
      status: 200,
      message: "Medicine find successfully!",
      findMedicine,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const getMedicineById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const findMedi = await prisma.medicine.findUnique({
      where: { id: req.params.id },
      include: {
        reminders: {
          include: {
            times: true,
          },
        },
      },
    });
    if (!findMedi) {
      return res
        .status(404)
        .json({ status: 404, message: "Medicine not found!" });
    }
    return res.status(200).json({
      status: 200,
      message: "Medicine find successfully!",
      findMedi,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const createMedicine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dateOnly = new Date(req.body.startDate);
    const scheduledTimes = req.body.scheduledTimes || [];

    const mainScheduledTime =
      scheduledTimes.length > 0
        ? createLocalDateTime(req.body.startDate, scheduledTimes[0])
        : dateOnly;

    const newMedicine = await prisma.medicine.create({
      data: {
        userEmail: req.body.userEmail,
        name: req.body.name,
        dosage: req.body.dosage,
        frequency: req.body.frequency,
        startDate: dateOnly,
        durationDays: req.body.durationDays,
        originalDurationDays: req.body.originalDurationDays,
        instructions: req.body.instructions,
        totalPills: req.body.totalPills,
        originalTotalPills: req.body.originalTotalPills,
        pillsPerDose: req.body.pillsPerDose,
        dosesPerDay: req.body.dosesPerDay,
        scheduledTime: mainScheduledTime,
        taken: false,
        reminders: {
          create: {
            repeatEveryDay: true,
            isActive: true,
            times: {
              create: scheduledTimes.map((time: string) => ({
                time: createLocalDateTime(req.body.startDate, time),
              })),
            },
          },
        },
      },
      include: {
        reminders: {
          include: {
            times: true,
          },
        },
      },
    });

    return res.status(201).json({
      status: 201,
      message: "Medicine created successfully",
      newMedicine,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const updateMedicine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("Update medicine request body:", req.body);
    console.log("Medicine ID:", req.params.id);

    const existingMedicine = await prisma.medicine.findUnique({
      where: { id: req.params.id },
    });

    if (!existingMedicine) {
      console.log("Medicine not found:", req.params.id);
      return res.status(404).json({
        status: 404,
        message: "Medicine not found",
      });
    }
    const dateOnly = req.body.startDate
      ? new Date(req.body.startDate)
      : undefined;
    const scheduledTimes = req.body.scheduledTimes || [];

    const dateString = req.body.startDate
      ? new Date(req.body.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    const mainScheduledTime =
      scheduledTimes.length > 0
        ? createLocalDateTime(dateString, scheduledTimes[0])
        : undefined;

    const updateData: any = {
      name: req.body.name,
      dosage: req.body.dosage,
      frequency: req.body.frequency,
      startDate: dateOnly,
      durationDays: req.body.durationDays,
      originalDurationDays: req.body.originalDurationDays,
      instructions: req.body.instructions,
      totalPills: req.body.totalPills,
      originalTotalPills: req.body.originalTotalPills,
      pillsPerDose: req.body.pillsPerDose,
      dosesPerDay: req.body.dosesPerDay,
    };

    Object.keys(updateData).forEach(
      (key) =>
        (updateData[key] === undefined || updateData[key] === null) &&
        delete updateData[key]
    );

    if (dateOnly) updateData.startDate = dateOnly;
    if (mainScheduledTime) updateData.scheduledTime = mainScheduledTime;
    if (typeof req.body.taken !== "undefined") {
      updateData.taken = req.body.taken;
    }

    console.log("Update data:", updateData);

    const updatedMedicine = await prisma.medicine.update({
      where: { id: req.params.id },
      data: updateData,
    });

    console.log("Medicine updated successfully:", updatedMedicine);

    if (scheduledTimes.length > 0) {
      console.log("Updating reminders with times:", scheduledTimes);
      await prisma.reminderTime.deleteMany({
        where: {
          reminder: {
            medicineId: req.params.id,
          },
        },
      });

      await prisma.reminder.deleteMany({
        where: { medicineId: req.params.id },
      });

      await prisma.reminder.create({
        data: {
          medicineId: req.params.id,
          repeatEveryDay: true,
          isActive: true,
          times: {
            create: scheduledTimes.map((time: string) => ({
              time: createLocalDateTime(dateString, time),
            })),
          },
        },
      });

      console.log("Reminders updated successfully");
    }

    return res.status(200).json({
      status: 200,
      message: "Medicine updated successfully",
      updatedMedicine,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const deletedMedicine = await prisma.medicine.delete({
      where: { id: req.params.id },
    });
    return res.status(200).json({
      status: 200,
      message: "Medicine deleted successfully",
      deletedMedicine,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const getMedicineTakenDay = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const dateStr = req.query.date as string;
    if (!dateStr) {
      return res
        .status(400)
        .json({ status: 400, message: "Missing date query param" });
    }
    const date = startOfDay(parseISO(dateStr));
    const takenDay = await prisma.medicineTakenDay.findFirst({
      where: { medicineId: id, date },
    });
    return res.status(200).json({ status: 200, takenDay });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const setMedicineTakenDay = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { date, taken } = req.body;
    if (!date || typeof taken !== "string") {
      return res
        .status(400)
        .json({ status: 400, message: "Missing date or taken in body" });
    }
    const day = startOfDay(parseISO(date));
    const takenDay = await prisma.medicineTakenDay.upsert({
      where: { medicineId_date: { medicineId: id, date: day } },
      update: { taken },
      create: { medicineId: id, date: day, taken },
    });
    return res.status(200).json({ status: 200, takenDay });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const getMedicineTakenHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;
    if (!from || !to) {
      return res
        .status(400)
        .json({ status: 400, message: "Missing from or to query param" });
    }
    const fromDate = startOfDay(parseISO(from as string));
    const toDate = startOfDay(parseISO(to as string));
    const takenHistory = await prisma.medicineTakenDay.findMany({
      where: {
        medicineId: id,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { date: "asc" },
    });
    return res.status(200).json({ status: 200, takenHistory });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const getRefillReminders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userEmail = req.query.userEmail as string;
    if (!userEmail) {
      return res
        .status(400)
        .json({ status: 400, message: "Missing userEmail query param" });
    }
    const medicines = await prisma.medicine.findMany({
      where: { userEmail },
      select: {
        id: true,
        name: true,
        totalPills: true,
        pillsPerDose: true,
        dosesPerDay: true,
      },
    });
    const now = new Date();
    const reminders = await Promise.all(
      medicines.map(async (med) => {
        const takenDays = await prisma.medicineTakenDay.findMany({
          where: { medicineId: med.id },
        });
        let dosesTaken = 0;
        takenDays.forEach((td) => {
          if (td.taken) {
            dosesTaken += td.taken
              .split("-")
              .map((v) => parseInt(v, 10) || 0)
              .reduce((a, b) => a + b, 0);
          }
        });
        const pillsPerDose = med.pillsPerDose ?? 1;
        const dosesPerDay = med.dosesPerDay ?? 1;
        const totalPills = med.totalPills ?? 0;
        const pillsLeft = totalPills - dosesTaken * pillsPerDose;
        const daysLeft = Math.floor(
          (pillsLeft > 0 ? pillsLeft : 0) / (pillsPerDose * dosesPerDay)
        );
        return {
          id: med.id,
          name: med.name,
          pillsLeft,
          daysLeft,
        };
      })
    );
    const filtered = reminders.filter(
      (med) => med.pillsLeft <= 20 || med.daysLeft <= 20
    );
    return res.status(200).json(filtered);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const refillMedicine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) {
      return res
        .status(404)
        .json({ status: 404, message: "Medicine not found" });
    }
    const updateData: any = {};
    if (medicine.originalTotalPills != null) {
      updateData.totalPills = medicine.originalTotalPills;
    }
    if (medicine.originalDurationDays != null) {
      updateData.durationDays = medicine.originalDurationDays;
    }
    await prisma.medicineTakenDay.deleteMany({ where: { medicineId: id } });
    const updated = await prisma.medicine.update({
      where: { id },
      data: updateData,
    });
    return res
      .status(200)
      .json({ status: 200, message: "Medicine refilled", updated });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const createReminder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { medicineId, time } = req.body;

    if (!medicineId || !time) {
      return res
        .status(400)
        .json({ status: 400, message: "Missing medicineId or time" });
    }

    const reminder = await prisma.reminder.create({
      data: {
        medicineId,
        repeatEveryDay: true,
        isActive: true,
        times: {
          create: {
            time: new Date(time),
          },
        },
      },
      include: {
        times: true,
      },
    });

    return res.status(201).json({
      status: 201,
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const createRemindersForExistingMedicines = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const medicinesWithoutReminders = await prisma.medicine.findMany({
      where: {
        reminders: {
          none: {},
        },
      },
    });

    const createdReminders = [];

    for (const medicine of medicinesWithoutReminders) {
      const reminder = await prisma.reminder.create({
        data: {
          medicineId: medicine.id,
          repeatEveryDay: true,
          isActive: true,
          times: {
            create: {
              time: medicine.scheduledTime,
            },
          },
        },
        include: {
          times: true,
        },
      });
      createdReminders.push(reminder);
    }

    return res.status(200).json({
      status: 200,
      message: `Created ${createdReminders.length} reminders for existing medicines`,
      createdReminders,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const getReminderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const reminder = await prisma.reminder.findFirst({
      where: { medicineId: id },
      include: {
        times: true,
      },
    });

    if (!reminder) {
      return res.status(404).json({
        status: 404,
        message: "Reminder not found for this medicine",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Reminder status retrieved successfully",
      reminder: {
        id: reminder.id,
        isActive: reminder.isActive,
        repeatEveryDay: reminder.repeatEveryDay,
        times: reminder.times.map((time) => ({
          id: time.id,
          time: time.time,
        })),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const toggleReminderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        status: 400,
        message: "isActive must be a boolean value",
      });
    }

    const reminder = await prisma.reminder.findFirst({
      where: { medicineId: id },
    });

    if (!reminder) {
      return res.status(404).json({
        status: 404,
        message: "Reminder not found for this medicine",
      });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id: reminder.id },
      data: { isActive },
      include: {
        times: true,
      },
    });

    return res.status(200).json({
      status: 200,
      message: `Reminder ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      reminder: {
        id: updatedReminder.id,
        isActive: updatedReminder.isActive,
        repeatEveryDay: updatedReminder.repeatEveryDay,
        times: updatedReminder.times.map((time) => ({
          id: time.id,
          time: time.time,
        })),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

export {
  getMedicineByEmail,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicineTakenDay,
  setMedicineTakenDay,
  getMedicineTakenHistory,
  getRefillReminders,
  refillMedicine,
  createReminder,
  createRemindersForExistingMedicines,
  getReminderStatus,
  toggleReminderStatus,
};
