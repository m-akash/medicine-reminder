import { Request, Response } from "express";
import prisma from "../config/db.config";
import { parseISO, startOfDay } from "date-fns";

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
    const newMedicine = await prisma.medicine.create({
      data: {
        userEmail: req.body.userEmail,
        name: req.body.name,
        dosage: req.body.dosage,
        frequency: req.body.frequency,
        startDate: dateOnly,
        durationDays: req.body.durationDays,
        originalDurationDays: req.body.durationDays, // set original
        instructions: req.body.instructions,
        totalPills: req.body.totalPills,
        originalTotalPills: req.body.totalPills, // set original
        pillsPerDose: req.body.pillsPerDose,
        dosesPerDay: req.body.dosesPerDay,
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
    const dateOnly = req.body.startDate
      ? new Date(req.body.startDate)
      : undefined;
    const updateData: any = {
      name: req.body.name,
      dosage: req.body.dosage,
      frequency: req.body.frequency,
      durationDays: req.body.durationDays,
      originalDurationDays: req.body.originalDurationDays,
      instructions: req.body.instructions,
      totalPills: req.body.totalPills,
      originalTotalPills: req.body.originalTotalPills,
      pillsPerDose: req.body.pillsPerDose,
      dosesPerDay: req.body.dosesPerDay,
    };
    if (dateOnly) updateData.startDate = dateOnly;
    if (typeof req.body.taken !== "undefined") {
      updateData.taken = req.body.taken;
    }
    const updatedMedicine = await prisma.medicine.update({
      where: { id: req.params.id },
      data: updateData,
    });
    return res.status(200).json({
      status: 200,
      message: "Medicine updated successfully",
      updatedMedicine,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
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

// Get taken status for a specific medicine and date
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

// Set taken status for a specific medicine and date
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
    // Upsert: update if exists, else create
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

// Get refill reminders for a user (medicines with low pillsLeft or daysLeft)
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
    // For each medicine, count total doses taken
    const reminders = await Promise.all(
      medicines.map(async (med) => {
        // Count total doses taken for this medicine
        const takenDays = await prisma.medicineTakenDay.findMany({
          where: { medicineId: med.id },
        });
        // Each takenDay.taken is a string like '1-0-1' (for 3 doses per day)
        let dosesTaken = 0;
        takenDays.forEach((td) => {
          if (td.taken) {
            dosesTaken += td.taken
              .split("-")
              .map((v) => parseInt(v, 10) || 0)
              .reduce((a, b) => a + b, 0);
          }
        });
        // Calculate pillsLeft and daysLeft
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

// Get all pharmacies
const getPharmacies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pharmacies = await prisma.pharmacy.findMany();
    return res.status(200).json(pharmacies);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

// PATCH /api/medications/:id/refill
const refillMedicine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine)
      return res
        .status(404)
        .json({ status: 404, message: "Medicine not found" });
    const updateData: any = {};
    if (medicine.originalTotalPills != null)
      updateData.totalPills = medicine.originalTotalPills;
    if (medicine.originalDurationDays != null)
      updateData.durationDays = medicine.originalDurationDays;
    // Delete all taken history for this medicine
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

export {
  getMedicineByEmail,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicineTakenDay,
  setMedicineTakenDay,
  getRefillReminders,
  getPharmacies,
  refillMedicine,
};
