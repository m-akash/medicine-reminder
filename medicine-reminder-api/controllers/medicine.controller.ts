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
        instructions: req.body.instructions,
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
    // Only set date if provided
    const dateOnly = req.body.startDate ? new Date(req.body.startDate) : undefined;
    // Build update data object
    const updateData: any = {
      name: req.body.name,
      dosage: req.body.dosage,
      frequency: req.body.frequency,
      durationDays: req.body.durationDays,
      instructions: req.body.instructions,
    };
    if (dateOnly) updateData.startDate = dateOnly;
    if (typeof req.body.taken !== 'undefined') updateData.taken = req.body.taken;
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
const getMedicineTakenDay = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const dateStr = req.query.date as string;
    if (!dateStr) {
      return res.status(400).json({ status: 400, message: "Missing date query param" });
    }
    const date = startOfDay(parseISO(dateStr));
    const takenDay = await prisma.medicineTakenDay.findFirst({
      where: { medicineId: id, date },
    });
    return res.status(200).json({ status: 200, takenDay });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Internal server error", error });
  }
};

// Set taken status for a specific medicine and date
const setMedicineTakenDay = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { date, taken } = req.body;
    if (!date || typeof taken !== "string") {
      return res.status(400).json({ status: 400, message: "Missing date or taken in body" });
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
    return res.status(500).json({ status: 500, message: "Internal server error", error });
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
};
