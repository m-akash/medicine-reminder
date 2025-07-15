import { Request, Response } from "express";
import prisma from "../config/db.config";

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

const createMedicine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const newMedicine = await prisma.medicine.create({
      data: {
        prescriptionId: req.body.prescriptionId,
        userEmail: req.body.userEmail,
        name: req.body.name,
        dosage: req.body.dosage,
        frequency: req.body.frequency,
        startDate: req.body.startDate,
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
    const updatedMedicine = await prisma.medicine.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        dosage: req.body.dosage,
        frequency: req.body.frequency,
        startDate: req.body.startDate,
        durationDays: req.body.durationDays,
        instructions: req.body.instructions,
      },
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

export { getMedicineByEmail, createMedicine, updateMedicine, deleteMedicine };
