// import { Request, Response } from "express";
// import prisma from "../config/db.config";

// const getPrescriptionsByUserEmail = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const prescriptions = await prisma.prescription.findMany({
//       where: { userEmail: req.params.userEmail },
//     });
//     return res.status(400).json({
//       status: 400,
//       message: "Find all the prescriptions successfully!",
//       prescriptions,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//       error,
//     });
//   }
// };

// const createPrescription = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { userEmail, imageUrl, notes } = req.body;
//     const newPrescription = await prisma.prescription.create({
//       data: {
//         userEmail,
//         imageUrl,
//         notes,
//       },
//     });
//     return res.status(201).json({
//       status: 201,
//       message: "Prescription created successfully!",
//       newPrescription,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//       error,
//     });
//   }
// };

// const updatePrescription = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { imageUrl, notes } = req.body;
//     const updatedPrescription = await prisma.prescription.update({
//       where: { id: req.params.id },
//       data: {
//         imageUrl,
//         notes,
//       },
//     });
//     return res
//       .status(200)
//       .json({ status: 200, message: "Update successful", updatedPrescription });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//       error,
//     });
//   }
// };

// const deletePrescription = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const deletedPrescription = await prisma.prescription.delete({
//       where: { id: req.params.id },
//     });
//     return res
//       .status(200)
//       .json({ status: 200, message: "Delete successful", deletedPrescription });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//       error,
//     });
//   }
// };

// export {
//   getPrescriptionsByUserEmail,
//   createPrescription,
//   updatePrescription,
//   deletePrescription,
// };
