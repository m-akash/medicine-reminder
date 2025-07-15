import express from "express";
import {
  createPrescription,
  deletePrescription,
  getPrescriptionsByUserEmail,
  updatePrescription,
} from "../controllers/prescription.controller";
const router = express.Router();

router.get("/prescriptions/:userEmail", getPrescriptionsByUserEmail);
router.post("/prescription", createPrescription);
router.put("/prescription/:id", updatePrescription);
router.delete("/prescription/:id", deletePrescription);

export default router;
