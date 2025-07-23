import express from "express";
import {
  createMedicine,
  deleteMedicine,
  getMedicineByEmail,
  getMedicineById,
  updateMedicine,
  getMedicineTakenDay,
  setMedicineTakenDay,
  getRefillReminders,
  getPharmacies,
  refillMedicine,
} from "../controllers/medicine.controller";
const router = express.Router();

router.get("/medicine/user/:userEmail", getMedicineByEmail);
router.get("/medicine/:id", getMedicineById);
router.post("/medicine", createMedicine);
router.put("/medicine/:id", updateMedicine);
router.delete("/medicine/:id", deleteMedicine);
router.patch("/medicine/:id/refill", refillMedicine);

// Per-day taken status endpoints
router.get("/medicine/:id/taken", getMedicineTakenDay);
router.put("/medicine/:id/taken", setMedicineTakenDay);

// New endpoints
router.get("/refill-reminders", getRefillReminders);
router.get("/pharmacies", getPharmacies);

export default router;
